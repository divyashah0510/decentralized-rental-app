import { expect } from "chai";
import { ethers } from "hardhat";
import { UserRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("UserRegistry", function () {
  let userRegistry: UserRegistry;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let addresses: SignerWithAddress[];

  beforeEach(async function () {
    [owner, user1, user2, ...addresses] = await ethers.getSigners();

    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
  });

  describe("User Registration", function () {
    it("Should register a new user", async function () {
      const userName = "John Doe";
      await userRegistry.connect(user1).registerUser(userName);

      const userProfile = await userRegistry.getUserProfile(user1.address);
      expect(userProfile.name).to.equal(userName);
      expect(userProfile.isRegistered).to.be.true;
    });

    it("Should not allow registering an already registered user", async function () {
      const userName = "John Doe";
      await userRegistry.connect(user1).registerUser(userName);

      await expect(
        userRegistry.connect(user1).registerUser("New Name")
      ).to.be.revertedWith("UR: User already registered");
    });

    it("Should not allow empty name registration", async function () {
      await expect(
        userRegistry.connect(user1).registerUser("")
      ).to.be.revertedWith("UR: Name cannot be empty");
    });

    it("Should update user profile", async function () {
      const userName = "John Doe";
      const newName = "John Smith";

      await userRegistry.connect(user1).registerUser(userName);
      await userRegistry.connect(user1).updateProfile(newName);

      const userProfile = await userRegistry.getUserProfile(user1.address);
      expect(userProfile.name).to.equal(newName);
    });

    it("Should not allow updating profile of unregistered user", async function () {
      await expect(
        userRegistry.connect(user1).updateProfile("New Name")
      ).to.be.revertedWith("UR: User not registered");
    });

    it("Should not allow empty name in profile update", async function () {
      await userRegistry.connect(user1).registerUser("John Doe");

      await expect(
        userRegistry.connect(user1).updateProfile("")
      ).to.be.revertedWith("UR: Name cannot be empty");
    });

    it("Should check if user is registered", async function () {
      expect(await userRegistry.isUserRegistered(user1.address)).to.be.false;

      await userRegistry.connect(user1).registerUser("John Doe");

      expect(await userRegistry.isUserRegistered(user1.address)).to.be.true;
    });

    it("Should get user profile", async function () {
      const userName = "John Doe";
      await userRegistry.connect(user1).registerUser(userName);

      const userProfile = await userRegistry.getUserProfile(user1.address);
      expect(userProfile.name).to.equal(userName);
      expect(userProfile.isRegistered).to.be.true;
    });

    it("Should return empty profile for unregistered user", async function () {
      const userProfile = await userRegistry.getUserProfile(user1.address);
      expect(userProfile.name).to.equal("");
      expect(userProfile.isRegistered).to.be.false;
    });
  });
}); 