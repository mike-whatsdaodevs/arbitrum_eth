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
  let provider = hre.ethers.provider
  const [signer] = await hre.ethers.getSigners()
  let my_address = signer.address;
  console.log('my_address is:', my_address)

  // We get the contract to deploy
  const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  const miner = await NFTMiner.deploy()
  await miner.deployed()

  let manageTx_miner = await miner.addManage(my_address)
  await manageTx_miner.wait();

  const NFTProperty = await hre.ethers.getContractFactory('NFTProperty')
  const property = await NFTProperty.deploy()
  await property.deployed()

  // NFTMiner deployed to: 0x9fd2f79fb26d4abD4aA762cCa637272bC1dF314A
  // NFTProperty deployed to: 0xe0124086d65c4fac87C95fF3f67c680a9552C470
  console.log('NFTMiner deployed to:', miner.address)
  console.log('NFTProperty deployed to:', property.address)

  let manageTx_property = await property.addManage(my_address)
  await manageTx_property.wait()

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
