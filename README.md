# Decentralized Rental Platform

This project implements a full-stack decentralized application (dApp) for a property rental marketplace built on the blockchain.

## Overview

The platform allows users to:
*   List properties for rent.
*   Browse and filter available properties.
*   Rent properties securely using smart contracts.
*   Manage rental agreements, including rent payments and security deposits handled via an Escrow contract.
*   (Future features could include reviews, maintenance requests, dispute resolution - contracts seem present but UI integration might vary).

The backend is built using Solidity smart contracts managed within a Hardhat development environment. The frontend is a modern web application built with Next.js.

## Technology Stack

**Backend (Solidity / Hardhat):**
*   **Solidity:** Language for smart contracts.
*   **Hardhat:** Ethereum development environment (compilation, testing, deployment).
*   **Ethers.js:** Library for interacting with Ethereum.
*   **TypeChain:** Generates TypeScript typings for smart contracts.
*   **OpenZeppelin Contracts:** Library for secure, standard smart contract components.
*   **Hardhat Ignition:** Module system for contract deployment.
*   **Ganache / Local Node:** Used for local blockchain development and testing.

**Frontend (Next.js / React):**
*   Covered in `frontend/README.md`

**Storage:**
*   **IPFS (via Pinata):** Used for storing off-chain data like property images and metadata JSON.

## Prerequisites

*   **Node.js:** v18 or later (check with `node -v`).
*   **npm** or **yarn:** Package managers for Node.js.
*   **Git:** Version control.
*   **Ganache:** A personal blockchain for Ethereum development (GUI or CLI). [Download Ganache](https://trufflesuite.com/ganache/)

## Project Setup (Backend)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/divyashah0510/decentralized-rental-app.git
    cd decentralized-rental-app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or: yarn install
    ```

3.  **Configure Environment Variables:**
    *   Create a `.env` file in the **root** directory.
    *   Copy the contents of `.env.example` (if it exists) or add the following variables:
        ```dotenv
        # .env (Root Directory)
        URL=HTTP://127.0.0.1:7545
        CHAINID=1337
        PRIVATE_KEY=<YOUR_GANACHE_ACCOUNT_PRIVATE_KEY>
        ```
    *   **`URL`**: The RPC URL of your running Ganache instance (check Ganache settings).
    *   **`CHAINID`**: The Network ID of your Ganache instance (usually `1337` for newer versions or `5777` for older ones).
    *   **`PRIVATE_KEY`**: The private key of the account you want to use for deployment in Ganache. **Important:** Ensure this account has sufficient ETH in Ganache to cover deployment gas costs (e.g., 10+ ETH recommended).

4.  **Compile Smart Contracts:**
    ```bash
    npx hardhat compile
    ```
    This compiles the Solidity contracts and generates TypeChain typings.

## Running the Backend (Local Development)

1.  **Start Ganache:** Launch your Ganache GUI or run the CLI.

2.  **Deploy Contracts:**
    *   Use Hardhat Ignition to deploy the contracts to your local Ganache network. You will likely have an Ignition module defined in the `ignition/modules/` directory (e.g., `RentalPlatformModule.ts`). Adjust the command if your module file has a different name.
    ```bash
    npx hardhat ignition deploy ./ignition/modules/YourDeploymentModule.ts --network ganache
    ```
    *   **Important:** Note the deployed contract addresses printed in the console output. You will need these for the frontend configuration.

## Running Tests

Execute the Hardhat tests:
```bash
npx hardhat test
```

To get a gas usage report:
```bash
REPORT_GAS=true npx hardhat test
```

## Project Structure (Root)

```
.
├── artifacts/        # Compiled contract artifacts and ABIs (generated)
├── cache/            # Hardhat cache (generated)
├── contracts/        # Solidity smart contracts
├── frontend/         # Next.js frontend application (see frontend/README.md)
├── ignition/         # Hardhat Ignition deployment modules and state
├── node_modules/     # Project dependencies
├── scripts/          # Optional deployment or utility scripts (if any)
├── test/             # Contract tests (Mocha/Chai/Hardhat)
├── typechain-types/  # TypeScript typings for contracts (generated)
├── .env              # Environment variables (Gitignored)
├── .gitignore        # Git ignore rules
├── hardhat.config.ts # Hardhat configuration
├── package.json      # Project dependencies and scripts
├── README.md         # This file
└── tsconfig.json     # TypeScript configuration for Hardhat
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.