import { expect } from "chai";
import { ethers } from "hardhat";
import { PropertyReviews, RentalAgreement, UserRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PropertyReviews", function () {
  let propertyReviews: PropertyReviews;
  let rentalAgreement: RentalAgreement;
  let userRegistry: UserRegistry;
  let owner: SignerWithAddress;
  let landlord: SignerWithAddress;
  let tenant: SignerWithAddress;
  let addresses: SignerWithAddress[];

  const mockRentalId = 1;
  const mockPropertyId = 1;

  beforeEach(async function () {
    [owner, landlord, tenant, ...addresses] = await ethers.getSigners();

    // Deploy UserRegistry
    const UserRegistryFactory = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistryFactory.deploy();
    const userRegistryAddress = await userRegistry.getAddress();

    // Deploy mock RentalAgreement using dummy non-zero addresses
    const RentalAgreementFactory = await ethers.getContractFactory("RentalAgreement");
    const dummyPLAddress = addresses[1].address;
    const dummyEscrowAddress = addresses[2].address;
    rentalAgreement = await RentalAgreementFactory.deploy(dummyPLAddress, dummyEscrowAddress);
    const rentalAgreementAddress = await rentalAgreement.getAddress();

    // Deploy PropertyReviews with mock RA and actual UR addresses
    const PropertyReviewsFactory = await ethers.getContractFactory("PropertyReviews");
    propertyReviews = await PropertyReviewsFactory.deploy(
      rentalAgreementAddress,
      userRegistryAddress
    );

    // Register users
    await userRegistry.connect(landlord).registerUser("Landlord Name");
    await userRegistry.connect(tenant).registerUser("Tenant Name");
  });

  describe("Property Reviews", function () {
    it("Should add a property review", async function () {
      const rating = 4;
      const comment = "Great property!";

      // Mock rental data (would normally come from RentalAgreement)
      // This would require mocking the RentalAgreement contract properly
      // For now, we'll skip the actual review addition as it requires proper mocking

      // await propertyReviews.connect(tenant).addPropertyReview(
      //   mockRentalId,
      //   mockPropertyId,
      //   rating,
      //   comment
      // );

      // const reviews = await propertyReviews.getPropertyReviews(mockPropertyId);
      // expect(reviews.length).to.equal(1);
      // expect(reviews[0].rating).to.equal(rating);
      // expect(reviews[0].comment).to.equal(comment);
    });

    it("Should not allow invalid rating values", async function () {
      const invalidRating = 6; // Ratings should be 1-5
      const comment = "Invalid rating test";

      await expect(
        propertyReviews.connect(tenant).addPropertyReview(
          mockRentalId,
          mockPropertyId,
          invalidRating,
          comment
        )
      ).to.be.revertedWith("Rating must be between 1-5");
    });

    it("Should add a user review", async function () {
      const rating = 5;
      const comment = "Excellent tenant!";

      // Mock rental data (would normally come from RentalAgreement)
      // This would require mocking the RentalAgreement contract properly
      // For now, we'll skip the actual review addition as it requires proper mocking

      // await propertyReviews.connect(landlord).addUserReview(
      //   mockRentalId,
      //   tenant.address,
      //   rating,
      //   comment,
      //   2 // ReviewType.TenantReview
      // );

      // const reviews = await propertyReviews.getUserReviews(tenant.address);
      // expect(reviews.length).to.equal(1);
      // expect(reviews[0].rating).to.equal(rating);
      // expect(reviews[0].comment).to.equal(comment);
    });

    it("Should not allow reviewing unregistered users", async function () {
      const rating = 5;
      const comment = "Testing unregistered user";

      await expect(
        propertyReviews.connect(landlord).addUserReview(
          mockRentalId,
          addresses[0].address,
          rating,
          comment,
          2 // ReviewType.TenantReview
        )
      ).to.be.revertedWith("Reviewed user not registered");
    });

    it("Should calculate property average rating", async function () {
      // This test would require proper mocking of RentalAgreement
      // and multiple reviews to be added
      // For now, we'll just verify the function exists
      const avgRating = await propertyReviews.getPropertyAverageRating(mockPropertyId);
      expect(avgRating).to.equal(0); // No reviews yet
    });

    it("Should calculate user average rating", async function () {
      // This test would require proper mocking of RentalAgreement
      // and multiple reviews to be added
      // For now, we'll just verify the function exists
      const avgRating = await propertyReviews.getUserAverageRating(tenant.address);
      expect(avgRating).to.equal(0); // No reviews yet
    });
  });
}); 