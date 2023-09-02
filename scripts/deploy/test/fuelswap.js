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
  let provider = hre.ethers.provider

  const [deployer] = await hre.ethers.getSigners()

  console.log('deployer:' + deployer.address)

  // We get the contract to deploy
  let busd = process.env.BUSD
 // let zfuel = process.env.ZWATT
  let mfuel = process.env.MFUEL;
  let wallet = process.env.MBTC_WALLET;
  console.log(busd, mfuel, wallet);
  const FuelSwap = await hre.ethers.getContractFactory('FuelSwap')
  const swap = await FuelSwap.deploy(busd, mfuel, wallet)
  await swap.deployed()
  // 0x3179e7dAe2ef85f5Ea135df9817ec9290Bbc9F32 v1
  console.log('swap deployed to:', swap.address)

  let manageTx = await swap.addManage(deployer.address)
  console.log('manageTx:' + manageTx.hash)
  await manageTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
