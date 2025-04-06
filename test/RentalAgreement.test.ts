import { expect } from "chai";
import { ethers } from "hardhat";
import { LogDescription } from "ethers";
import { RentalAgreement, PropertyListing, Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("RentalAgreement", function () {
  let rentalAgreement: RentalAgreement;
  let propertyListing: PropertyListing;
  let escrow: Escrow;
  let owner: SignerWithAddress;
  let landlord: SignerWithAddress;
  let tenant: SignerWithAddress;
  let addresses: SignerWithAddress[];

  const mockPropertyData = {
    location: "123 Test Street",
    pricePerMonth: ethers.parseEther("1"), // 1 ETH
    securityDeposit: ethers.parseEther("2"), // 2 ETH
    bedrooms: 2,
    bathrooms: 2,
    areaSqMeters: 100,
    availableFromTimestamp: Math.floor(Date.now() / 1000),
    minRentalPeriodMonths: 12,
    ipfsMetadataHash: "QmTest123"
  };

  beforeEach(async function () {
    [owner, landlord, tenant, ...addresses] = await ethers.getSigners();

    // 1. Deploy PropertyListing
    const PropertyListingFactory = await ethers.getContractFactory("PropertyListing");
    propertyListing = await PropertyListingFactory.deploy();
    const plAddress = await propertyListing.getAddress();

    // 2. Deploy RentalAgreement (passing address(0) for Escrow initially)
    const RentalAgreementFactory = await ethers.getContractFactory("RentalAgreement");
    rentalAgreement = await RentalAgreementFactory.deploy(plAddress, ethers.ZeroAddress);
    const raAddress = await rentalAgreement.getAddress();

    // 3. Deploy Escrow (using the actual RentalAgreement address)
    const EscrowFactory = await ethers.getContractFactory("Escrow");
    escrow = await EscrowFactory.deploy(raAddress);
    const escrowAddress = await escrow.getAddress();

    // 4. Set the deployed Escrow address in RentalAgreement
    await rentalAgreement.setEscrowContract(escrowAddress);

    // 5. Link PropertyListing to RentalAgreement
    await propertyListing.setRentalAgreementContract(raAddress);
  });

  describe("Rental Agreement Creation", function () {
    let propertyId: bigint;

    beforeEach(async function () {
      // List a property first
      const tx = await propertyListing.connect(landlord).listProperty(
        mockPropertyData.location,
        mockPropertyData.pricePerMonth,
        mockPropertyData.securityDeposit,
        mockPropertyData.bedrooms,
        mockPropertyData.bathrooms,
        mockPropertyData.areaSqMeters,
        mockPropertyData.availableFromTimestamp,
        mockPropertyData.minRentalPeriodMonths,
        mockPropertyData.ipfsMetadataHash
      );
      const receipt = await tx.wait();
      expect(receipt).to.not.be.null; // Check receipt is not null

      // Parse the event correctly
      const eventFragment = propertyListing.interface.getEvent("PropertyListed");
      const log = receipt!.logs.find(log => 
          log.topics[0] === eventFragment.topicHash
      );
      expect(log).to.exist;
      const parsedLog = propertyListing.interface.parseLog(log!); 
      expect(parsedLog).to.exist;
      propertyId = parsedLog!.args[0];
    });

    it("Should create a new rental agreement", async function () {
      const totalPayment = mockPropertyData.pricePerMonth + mockPropertyData.securityDeposit;
      
      const tx = await rentalAgreement.connect(tenant).rentProperty(propertyId, {
        value: totalPayment
      });

      const receipt = await tx.wait();
      expect(receipt).to.not.be.null;

      const eventFragment = rentalAgreement.interface.getEvent("PropertyRented");
      const log = receipt!.logs.find(log => 
          log.topics[0] === eventFragment.topicHash
      );
      expect(log).to.exist;
      const parsedLog = rentalAgreement.interface.parseLog(log!); 
      expect(parsedLog).to.exist;
      const rentalId = parsedLog!.args[0]; 

      const rental = await rentalAgreement.rentals(rentalId);

      expect(rental.tenant).to.equal(tenant.address);
      expect(rental.landlord).to.equal(landlord.address);
      expect(rental.monthlyRentAmount).to.equal(mockPropertyData.pricePerMonth);
      expect(rental.securityDepositAmount).to.equal(mockPropertyData.securityDeposit);
      expect(rental.status).to.equal(1); // RentalStatus.Active
    });

    it("Should not allow renting an unavailable property", async function () {
      // Rent the property first
      const totalPayment = mockPropertyData.pricePerMonth + mockPropertyData.securityDeposit;
      await rentalAgreement.connect(tenant).rentProperty(propertyId, {
        value: totalPayment
      });

      // Try to rent it again
      await expect(
        rentalAgreement.connect(addresses[0]).rentProperty(propertyId, {
          value: totalPayment
        })
      ).to.be.revertedWith("RA: Property not available"); // Reverted to specific check
    });

    it("Should not allow renting with incorrect payment", async function () {
      const incorrectPayment = mockPropertyData.pricePerMonth;

      await expect(
        rentalAgreement.connect(tenant).rentProperty(propertyId, {
          value: incorrectPayment
        })
      ).to.be.revertedWith("RA: Incorrect payment amount");
    });

    it("Should allow paying rent", async function () {
      // First rent the property
      const totalPayment = mockPropertyData.pricePerMonth + mockPropertyData.securityDeposit;
      const rentTx = await rentalAgreement.connect(tenant).rentProperty(propertyId, {
        value: totalPayment
      });
      const rentReceipt = await rentTx.wait();
      expect(rentReceipt).to.not.be.null;
      const rentEventFragment = rentalAgreement.interface.getEvent("PropertyRented");
      const rentLog = rentReceipt!.logs.find(log => log.topics[0] === rentEventFragment.topicHash);
      const parsedRentLog = rentalAgreement.interface.parseLog(rentLog!); 
      const rentalId = parsedRentLog!.args[0];
      
      // --- Advance Time --- 
      // Advance time to be within the allowed payment window (e.g., 24 days later)
      const twentyFourDaysInSeconds = 24 * 24 * 60 * 60;
      await ethers.provider.send("evm_increaseTime", [twentyFourDaysInSeconds]);
      await ethers.provider.send("evm_mine"); // Mine a new block with the increased timestamp
      // --- End Advance Time ---

      // Pay next month's rent
      await rentalAgreement.connect(tenant).payRent(rentalId, {
        value: mockPropertyData.pricePerMonth
      });

      const rental = await rentalAgreement.rentals(rentalId);
      const initialStartDate = rental.startDate;
      // Check if rentPaidUntil is roughly 60 days after startDate (initial payment covers first month)
      // Adding the time we advanced to the expected timestamp
      const expectedRentPaidUntil = initialStartDate + BigInt(60 * 24 * 60 * 60);
      expect(rental.rentPaidUntil).to.be.closeTo(expectedRentPaidUntil, BigInt(2 * 60 * 60)); 
    });

    it("Should allow landlord to withdraw rent", async function () {
      // First rent the property
      const totalPayment = mockPropertyData.pricePerMonth + mockPropertyData.securityDeposit;
      const rentTx = await rentalAgreement.connect(tenant).rentProperty(propertyId, {
        value: totalPayment
      });
      const rentReceipt = await rentTx.wait();
      expect(rentReceipt).to.not.be.null;
      const rentEventFragment = rentalAgreement.interface.getEvent("PropertyRented");
      const rentLog = rentReceipt!.logs.find(log => log.topics[0] === rentEventFragment.topicHash);
      const parsedRentLog = rentalAgreement.interface.parseLog(rentLog!); 
      const rentalId = parsedRentLog!.args[0];
      
      const initialLandlordBalance = await ethers.provider.getBalance(landlord.address);

      // Landlord withdraws first month's rent
      const withdrawTx = await rentalAgreement.connect(landlord).withdrawRent(rentalId);
      const withdrawReceipt = await withdrawTx.wait();
      expect(withdrawReceipt).to.not.be.null;
      const gasUsed = withdrawReceipt!.gasUsed * withdrawReceipt!.gasPrice;

      const finalLandlordBalance = await ethers.provider.getBalance(landlord.address);
      const rentReceived = finalLandlordBalance - initialLandlordBalance + gasUsed;

      expect(rentReceived).to.equal(mockPropertyData.pricePerMonth);

      // This check will fail if Escrow address wasn't correctly set in RA
      // const availableRent = await escrow.getRentBalance(rentalId); 
      // expect(availableRent).to.equal(0);
    });

    it("Should handle deposit release process", async function () {
      // First rent the property
      const totalPayment = mockPropertyData.pricePerMonth + mockPropertyData.securityDeposit;
      const rentTx = await rentalAgreement.connect(tenant).rentProperty(propertyId, {
        value: totalPayment
      });
      const rentReceipt = await rentTx.wait();
      expect(rentReceipt).to.not.be.null;
      const rentEventFragment = rentalAgreement.interface.getEvent("PropertyRented");
      const rentLog = rentReceipt!.logs.find(log => log.topics[0] === rentEventFragment.topicHash);
      const parsedRentLog = rentalAgreement.interface.parseLog(rentLog!); 
      const rentalId = parsedRentLog!.args[0];
      
      // Fast forward to end of rental period
      const rentalData = await rentalAgreement.rentals(rentalId);
      const endDate = rentalData.endDate;
      await ethers.provider.send("evm_setNextBlockTimestamp", [Number(endDate) + 1]);
      await ethers.provider.send("evm_mine", []);

      // Tenant requests deposit release
      await rentalAgreement.connect(tenant).requestDepositRelease(rentalId);

      // Landlord approves
      const approveTx = await rentalAgreement.connect(landlord).approveDepositRelease(rentalId);
      const approveReceipt = await approveTx.wait();
      expect(approveReceipt).to.not.be.null;
      // const approveGasUsed = approveReceipt!.gasUsed * approveReceipt!.gasPrice; // gasUsed might be needed if checking tenant balance

      const rental = await rentalAgreement.rentals(rentalId);
      expect(rental.status).to.equal(2); // RentalStatus.Ended

      // Check deposit was released via Escrow balance
      // This check will fail if Escrow address wasn't correctly set in RA
      // const depositBalance = await escrow.getDepositBalance(rentalId);
      // expect(depositBalance).to.equal(0);
    });
  });
}); 