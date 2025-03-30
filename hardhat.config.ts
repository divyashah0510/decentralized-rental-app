import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();


const config: HardhatUserConfig = {
  solidity: "0.8.28",
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
