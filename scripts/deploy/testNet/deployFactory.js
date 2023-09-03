// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  const factory = await NFTFactory.deploy(process.env.NFT, process.env.REPOS)
  await factory.deployed()

  // 0xe2B51C181eCe7D4BfAfd448072671A79d59F7CEb v1
  console.log('NFTFactory deployed to:', factory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
