// frontend/lib/config.ts
export const contractAddresses = {
  propertyListing: "0xcc07764D8cB4fbC04Cb6eB3100Ba378441Baa9f7",
  userRegistry: "0xD0Dab21f922afdAf61F27562141838CeAD411d50",
  rentalAgreement: "0xFf98b7D008B33dc8c645aE73a4f97D8b5B665f45",
  escrow: "0xBf51F1913C20995aD6D536c2f42ff10afB2f9A85",
  maintenanceRequests: "0x938a1F8607798576D74d21De65828262282b3364",
  propertyReviews: "0xC80D1E3E8DbC3E070030f75F941f360cE14CE5C0",
  disputeResolution: "0x44f5173E509f8270E9FfcE736cAB853eCFdf720e",
} as const; // Use "as const" for better type safety

export const networkConfig = {
  chainId: 1337, // Ganache default chain ID
  rpcUrl: "http://127.0.0.1:7545", // Default Ganache RPC URL
} as const;

// Type helper for contract names
export type ContractName = keyof typeof contractAddresses; 