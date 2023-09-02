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
  const BTCZToken = await hre.ethers.getContractFactory('BTCZToken')
  const zBTCToken = await BTCZToken.deploy('0x9F6C71dE830F70dFc352F13fE34F351D7fA9B648')
  await zBTCToken.deployed()

  // const ZWattToken = await hre.ethers.getContractFactory('ZWattToken')
  // const zWattToken = await ZWattToken.deploy('0x9F6C71dE830F70dFc352F13fE34F351D7fA9B648', '0x9F6C71dE830F70dFc352F13fE34F351D7fA9B648')
  // await zWattToken.deployed()

  // BTCZToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  // ZFuelToken deployed to: 0xc59925B8747831F1B8bAEC794194A5B05395CD4B
  console.log('BTCZToken deployed to:', zBTCToken.address)
  // console.log('ZFuelToken deployed to:', zWattToken.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
