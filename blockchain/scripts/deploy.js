const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // 1. Get the contract to deploy
  const CodaToken = await hre.ethers.getContractFactory("CodaToken");

  // 2. Deploy it
  const codaToken = await CodaToken.deploy();

  // 3. Wait for it to finish deploying
  await codaToken.waitForDeployment();

  const address = await codaToken.getAddress();

  console.log("-----------------------------------------------");
  console.log("SUCCESS! CODA Token deployed to:", address);
  console.log("-----------------------------------------------");
  console.log("SAVE THIS ADDRESS! You will need it for your backend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});