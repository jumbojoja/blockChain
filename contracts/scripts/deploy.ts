import { ethers } from "hardhat";

async function main() {
  const BuyMyRoom = await ethers.getContractFactory("BuyMyRoom");
  const buyMyRoom = await BuyMyRoom.deploy();
  await buyMyRoom.deployed();

  console.log(`BuyMyRoom deployed to ${buyMyRoom.address}`);

  const erc20 = await buyMyRoom.myERC20();
  console.log(`erc20 contract has been deployed successfully in ${erc20}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});