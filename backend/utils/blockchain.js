import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const CODA_ABI = [
  "function mintReward(address to, uint256 amount) public",
  "function balanceOf(address account) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const codaContract = new ethers.Contract(
  process.env.CODA_CONTRACT_ADDRESS, 
  CODA_ABI, 
  adminWallet
);

/**
 * Mints CODA Tokens on the blockchain.
 * Returns an object with success status and specific error message.
 */
export const mintCodaTokens = async (recipientAddress, tokenAmount) => {
  try {
    console.log(`--- Initiating Blockchain Mint: ${tokenAmount} Tokens ---`);
    
    // Convert to 18 decimals
    const amount = ethers.parseUnits(tokenAmount.toString(), 18);

    // Send transaction
    const tx = await codaContract.mintReward(recipientAddress, amount);
    console.log("Transaction pending... Hash:", tx.hash);
    
    const receipt = await tx.wait(); 
    console.log("✅ Blockchain Success confirmed!");
    
    return { success: true, hash: receipt.hash };
  } catch (error) {
    console.error("BLOCKCHAIN RAW ERROR:", error);

    let friendlyMessage = "Blockchain transaction failed.";

    // ✅ DETECT INSUFFICIENT ETH FOR GAS
    if (error.code === 'INSUFFICIENT_FUNDS' || error.message.toLowerCase().includes("insufficient funds")) {
      friendlyMessage = "INSUFFICIENT ETH: The Admin wallet needs Sepolia ETH to pay for gas fees.";
    } 
    // Detect if the network is busy or nonce is wrong
    else if (error.message.toLowerCase().includes("nonce") || error.message.toLowerCase().includes("underpriced")) {
      friendlyMessage = "Network Busy: Transaction pending. Please wait 30 seconds and try again.";
    }
    else {
      friendlyMessage = error.reason || error.message;
    }

    return { success: false, error: friendlyMessage };
  }
};