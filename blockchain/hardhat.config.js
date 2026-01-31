require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" }); // Uses your root .env file

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""; 

module.exports = {
  solidity: "0.8.20",
  networks: {
    // For Ethereum Sepolia
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    },
    // For your Hyperledger Besu node later
    besu: {
      url: "http://127.0.0.1:8545", // Your local Besu RPC
      accounts: [PRIVATE_KEY]
    }
  }
};