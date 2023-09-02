// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  const marketPlace = await MarketPlace.deploy(process.env.ZWATT, process.env.BTCZ, process.env.NFT, '0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  await marketPlace.deployed()

  // MarketPlace deployed to: 0xcCe05351Bd328f29478d0eCc6201574618A4f891
  console.log('MarketPlace deployed to:', marketPlace.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
