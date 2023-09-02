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
  let busd = process.env.BUSD;
  let zfuel = process.env.ZWATT_NEW;
  let wallet = process.env.WALLET;
  console.log(busd, zfuel, wallet);
  const Exchange = await hre.ethers.getContractFactory('Exchange')
  const exchange = await Exchange.deploy(busd, zfuel, wallet)
  await exchange.deployed()
  // 0x3179e7dAe2ef85f5Ea135df9817ec9290Bbc9F32 v1
  console.log('exchange deployed to:', exchange.address)

  await hre.run("verify:verify", {
    address: exchange.address,
    constructorArguments: [
        busd,
        zfuel,
        wallet
      ],
    }
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
