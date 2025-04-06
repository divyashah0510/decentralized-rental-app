import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "hardhat";

const RentalPlatformModule = buildModule("RentalPlatformModule", (m) => {
  // 1. Deploy PropertyListing
  const plContract = m.contract("PropertyListing");

  // 2. Deploy UserRegistry
  const urContract = m.contract("UserRegistry");

  // 3. Deploy RentalAgreement (passing address(0) for Escrow initially)
  // We use the contract instance `plContract` directly, Ignition resolves the address.
  const raContract = m.contract("RentalAgreement", [
    plContract,
    ethers.ZeroAddress, // Initial Escrow address
  ]);

  // 4. Deploy Escrow (using the actual RentalAgreement address)
  // Pass the contract instance `raContract`.
  const escrowContract = m.contract("Escrow", [raContract]);

  // 5. Set the deployed Escrow address in RentalAgreement using m.call
  m.call(raContract, "setEscrowContract", [escrowContract]);

  // 6. Link PropertyListing to RentalAgreement using m.call
  m.call(plContract, "setRentalAgreementContract", [raContract]);

  // 7. Deploy MaintenanceRequests
  const maintenanceContract = m.contract("MaintenanceRequests", [raContract]);

  // 8. Deploy PropertyReviews
  const reviewsContract = m.contract("PropertyReviews", [
    raContract,
    urContract,
  ]);

  // 9. Deploy DisputeResolution
  const disputeContract = m.contract("DisputeResolution", [
    raContract,
    escrowContract,
  ]);

  // Return deployed contracts for potential use in scripts or tests
  return {
    plContract,
    urContract,
    raContract,
    escrowContract,
    maintenanceContract,
    reviewsContract,
    disputeContract,
  };
});

export default RentalPlatformModule; 