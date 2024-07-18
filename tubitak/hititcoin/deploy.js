// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = hre.ethers.utils.parseUnits('1000000', 18); // 1,000,000 HIT
  const HititCoin = await hre.ethers.getContractFactory("HititCoin");
  const hititCoin = await HititCoin.deploy(initialSupply);

  console.log("HititCoin deployed to:", hititCoin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
