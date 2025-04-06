import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200 // Default value, can be adjusted
      },
      viaIR: true // Enable the Yul intermediate representation pipeline
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      url: process.env.URL || '',
      chainId: parseInt(process.env.CHAINID || ''),
      accounts: [process.env.PRIVATE_KEY || '']
    }
  }
};

export default config;
