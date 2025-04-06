import { expect } from "chai";
import { ethers } from "hardhat";
import { PropertyListing } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PropertyListing", function () {
  let propertyListing: PropertyListing;
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
    availableFromTimestamp: Math.floor(Date.now() / 1000), // Current timestamp
    minRentalPeriodMonths: 12,
    ipfsMetadataHash: "QmTest123"
  };

  beforeEach(async function () {
    [owner, landlord, tenant, ...addresses] = await ethers.getSigners();

    const PropertyListing = await ethers.getContractFactory("PropertyListing");
    propertyListing = await PropertyListing.deploy();
  });

  describe("Property Listing", function () {
    it("Should list a new property", async function () {
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
      const event = receipt?.logs[0];
      expect(event).to.exist;

      const propertyId = 1; // First property should have ID 1
      const property = await propertyListing.properties(propertyId);

      expect(property.owner).to.equal(landlord.address);
      expect(property.location).to.equal(mockPropertyData.location);
      expect(property.pricePerMonth).to.equal(mockPropertyData.pricePerMonth);
      expect(property.securityDeposit).to.equal(mockPropertyData.securityDeposit);
      expect(property.isListed).to.be.true;
      expect(property.isAvailable).to.be.true;
    });

    it("Should update a property", async function () {
      // First list a property
      await propertyListing.connect(landlord).listProperty(
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

      const propertyId = 1;
      const newPrice = ethers.parseEther("1.5");
      const newDeposit = ethers.parseEther("3");

      await propertyListing.connect(landlord).updateProperty(
        propertyId,
        mockPropertyData.location,
        newPrice,
        newDeposit,
        mockPropertyData.bedrooms,
        mockPropertyData.bathrooms,
        mockPropertyData.areaSqMeters,
        mockPropertyData.availableFromTimestamp,
        mockPropertyData.minRentalPeriodMonths,
        mockPropertyData.ipfsMetadataHash
      );

      const property = await propertyListing.properties(propertyId);
      expect(property.pricePerMonth).to.equal(newPrice);
      expect(property.securityDeposit).to.equal(newDeposit);
    });

    it("Should not allow non-owner to update property", async function () {
      // First list a property
      await propertyListing.connect(landlord).listProperty(
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

      const propertyId = 1;
      await expect(
        propertyListing.connect(tenant).updateProperty(
          propertyId,
          mockPropertyData.location,
          mockPropertyData.pricePerMonth,
          mockPropertyData.securityDeposit,
          mockPropertyData.bedrooms,
          mockPropertyData.bathrooms,
          mockPropertyData.areaSqMeters,
          mockPropertyData.availableFromTimestamp,
          mockPropertyData.minRentalPeriodMonths,
          mockPropertyData.ipfsMetadataHash
        )
      ).to.be.revertedWith("PL: Caller not owner");
    });

    it("Should unlist a property", async function () {
      // First list a property
      await propertyListing.connect(landlord).listProperty(
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

      const propertyId = 1;
      await propertyListing.connect(landlord).unlistProperty(propertyId);

      const property = await propertyListing.properties(propertyId);
      expect(property.isListed).to.be.false;
      expect(property.isAvailable).to.be.false;
    });

    it("Should get property by ID", async function () {
      await propertyListing.connect(landlord).listProperty(
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

      const propertyId = 1;
      const property = await propertyListing.properties(propertyId);

      expect(property.owner).to.equal(landlord.address);
      expect(property.location).to.equal(mockPropertyData.location);
      expect(property.pricePerMonth).to.equal(mockPropertyData.pricePerMonth);
    });

    it("Should get properties by owner", async function () {
      const location1 = "123 Test Street";
      const location2 = "456 Another Street";
      // List two properties
      await propertyListing.connect(landlord).listProperty(
        location1,
        mockPropertyData.pricePerMonth,
        mockPropertyData.securityDeposit,
        mockPropertyData.bedrooms,
        mockPropertyData.bathrooms,
        mockPropertyData.areaSqMeters,
        mockPropertyData.availableFromTimestamp,
        mockPropertyData.minRentalPeriodMonths,
        mockPropertyData.ipfsMetadataHash
      );

      await propertyListing.connect(landlord).listProperty(
        location2,
        mockPropertyData.pricePerMonth,
        mockPropertyData.securityDeposit,
        mockPropertyData.bedrooms,
        mockPropertyData.bathrooms,
        mockPropertyData.areaSqMeters,
        mockPropertyData.availableFromTimestamp,
        mockPropertyData.minRentalPeriodMonths,
        mockPropertyData.ipfsMetadataHash
      );

      // Query the PropertyListed event for properties listed by this landlord
      const filter = propertyListing.filters.PropertyListed(undefined, landlord.address);
      const events = await propertyListing.queryFilter(filter);

      expect(events.length).to.equal(2);

      // Optionally check the details from the events or fetch properties by ID
      const propertyId1 = events[0].args.propertyId;
      const propertyId2 = events[1].args.propertyId;

      const property1 = await propertyListing.properties(propertyId1);
      const property2 = await propertyListing.properties(propertyId2);

      expect(property1.owner).to.equal(landlord.address);
      expect(property2.owner).to.equal(landlord.address);
      expect([property1.location, property2.location]).to.include.members([location1, location2]);
    });
  });
}); 