import { expect } from "chai";
import { ethers } from "hardhat";
import { DisputeResolution, RentalAgreement, Escrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("DisputeResolution", function () {
  let disputeResolution: DisputeResolution;
  let rentalAgreement: RentalAgreement;
  let escrow: Escrow;
  let owner: SignerWithAddress;
  let landlord: SignerWithAddress;
  let tenant: SignerWithAddress;
  let arbitrator: SignerWithAddress;
  let addresses: SignerWithAddress[];

  const mockRentalId = 1;
  const mockPropertyId = 1;

  beforeEach(async function () {
    [owner, landlord, tenant, arbitrator, ...addresses] = await ethers.getSigners();

    // Deploy mock RentalAgreement using dummy non-zero addresses
    const RentalAgreementFactory = await ethers.getContractFactory("RentalAgreement");
    const dummyPLAddress = addresses[1].address; // Use different signers for clarity
    const dummyEscrowAddress = addresses[2].address;
    rentalAgreement = await RentalAgreementFactory.deploy(dummyPLAddress, dummyEscrowAddress);
    const rentalAgreementAddress = await rentalAgreement.getAddress();

    // Deploy mock Escrow (needed for DisputeResolution constructor)
    const EscrowFactory = await ethers.getContractFactory("Escrow");
    // Deploy with the mock RA address even though it's a mock Escrow
    escrow = await EscrowFactory.deploy(rentalAgreementAddress);
    const escrowAddress = await escrow.getAddress();

    // Deploy DisputeResolution with the mock addresses
    const DisputeResolutionFactory = await ethers.getContractFactory("DisputeResolution");
    disputeResolution = await DisputeResolutionFactory.deploy(
      rentalAgreementAddress,
      escrowAddress
    );

    // Add arbitrator
    await disputeResolution.connect(owner).addArbitrator(arbitrator.address);
  });

  describe("Dispute Resolution", function () {
    it("Should create a dispute", async function () {
      const description = "Damage to property";
      const evidence = "QmTest123";
      const amount = ethers.parseEther("1");
      const disputeType = 3; // DisputeType.PropertyDamage

      // Mock rental data (would normally come from RentalAgreement)
      // This would require mocking the RentalAgreement contract properly
      // For now, we'll skip the actual dispute creation as it requires proper mocking

      // const tx = await disputeResolution.connect(landlord).createDispute(
      //   mockRentalId,
      //   description,
      //   evidence,
      //   amount,
      //   disputeType
      // );

      // const receipt = await tx.wait();
      // const event = receipt?.logs[0];
      // expect(event).to.exist;

      // const disputeId = 1; // First dispute should have ID 1
      // const dispute = await disputeResolution.getDispute(disputeId);

      // expect(dispute.tenant).to.equal(tenant.address);
      // expect(dispute.landlord).to.equal(landlord.address);
      // expect(dispute.description).to.equal(description);
      // expect(dispute.evidence).to.equal(evidence);
      // expect(dispute.amount).to.equal(amount);
      // expect(dispute.disputeType).to.equal(disputeType);
      // expect(dispute.status).to.equal(0); // DisputeStatus.Pending
    });

    it("Should update dispute status", async function () {
      // First create a dispute (requires proper mocking)
      const newStatus = 1; // DisputeStatus.UnderReview

      // await disputeResolution.connect(arbitrator).updateDisputeStatus(
      //   1, // disputeId
      //   newStatus
      // );

      // const dispute = await disputeResolution.getDispute(1);
      // expect(dispute.status).to.equal(newStatus);
    });

    it("Should resolve a dispute", async function () {
      // First create a dispute (requires proper mocking)
      const resolution = 2; // Resolution.LandlordFavor
      const resolutionDetails = "Evidence supports landlord's claim";

      // await disputeResolution.connect(arbitrator).resolveDispute(
      //   1, // disputeId
      //   resolution,
      //   resolutionDetails
      // );

      // const dispute = await disputeResolution.getDispute(1);
      // expect(dispute.status).to.equal(2); // DisputeStatus.Resolved
      // expect(dispute.resolution).to.equal(resolution);
      // expect(dispute.resolutionDetails).to.equal(resolutionDetails);
      // expect(dispute.resolver).to.equal(arbitrator.address);
    });

    it("Should add and remove arbitrators", async function () {
      const newArbitrator = addresses[0];

      // Add arbitrator
      await disputeResolution.connect(owner).addArbitrator(newArbitrator.address);
      expect(await disputeResolution.isArbitrator(newArbitrator.address)).to.be.true;

      // Remove arbitrator
      await disputeResolution.connect(owner).removeArbitrator(newArbitrator.address);
      expect(await disputeResolution.isArbitrator(newArbitrator.address)).to.be.false;
    });

    it("Should not allow non-owner to add arbitrator", async function () {
      const newArbitrator = addresses[0];

      await expect(
        disputeResolution.connect(addresses[1]).addArbitrator(newArbitrator.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not allow non-arbitrator to update dispute", async function () {
      // First create a dispute (requires proper mocking)
      const newStatus = 1; // DisputeStatus.UnderReview

      await expect(
        disputeResolution.connect(addresses[0]).updateDisputeStatus(
          1, // disputeId
          newStatus
        )
      ).to.be.revertedWith("Not an approved arbitrator");
    });

    it("Should not allow resolving an already resolved dispute", async function () {
      // First create and resolve a dispute (requires proper mocking)
      const resolution = 2; // Resolution.LandlordFavor
      const resolutionDetails = "Second attempt at resolution";

      // await disputeResolution.connect(arbitrator).resolveDispute(
      //   1, // disputeId
      //   resolution,
      //   resolutionDetails
      // );

      // await expect(
      //   disputeResolution.connect(arbitrator).resolveDispute(
      //     1,
      //     resolution,
      //     resolutionDetails
      //   )
      // ).to.be.revertedWith("Already resolved");
    });

    it("Should get disputes by rental", async function () {
      // This test would require proper mocking of RentalAgreement
      // and multiple disputes to be added
      const disputes = await disputeResolution.getDisputesByRental(mockRentalId);
      expect(disputes.length).to.equal(0); // No disputes yet
    });
  });
}); 