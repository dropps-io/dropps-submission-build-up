import { ethers } from "hardhat";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();
  const LooksoValidator = await ethers.getContractFactory("LooksoPostValidator");
  const looksoValidator = await LooksoValidator.deploy(owner.address);

  await looksoValidator.deployed();

  console.log(looksoValidator.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
