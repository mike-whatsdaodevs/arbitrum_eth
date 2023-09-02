// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  await hre.run('compile');

  let provider = ethers.provider;
  let signer = provider.getSigner();

  let my_address = await signer.getAddress();
  console.log(my_address);

  // ZStaking
  // let btcz_address = process.env.BTCZ_TEST;
  // let zwatt_address = process.env.ZWATT_TEST;
  // let btcz_old_address = process.env.BTCZ_OLD_TEST;
  // let zwatt_old_address = process.env.ZWATT_OLD_TEST;


  let busd = process.env.BUSD;
  let zfuel = process.env.ZWATT_NEW;
  let wallet = process.env.WALLET;


  const Exchange = await hre.ethers.getContractFactory('Exchange')
  const exchange = await Exchange.deploy();
  await exchange.deployed()

  let implement_address = exchange.address;

  console.log("exchange address is", implement_address);

  const ExchangeObj = await hre.ethers.getContractAt('Exchange', implement_address, signer)
  const initialize_data = await ExchangeObj.populateTransaction.initialize(
    busd, zfuel, wallet
  );
  console.log("initialize data is",initialize_data)

  const BTCZProxy = await hre.ethers.getContractFactory('BTCZProxy')
  let proxy = await BTCZProxy.deploy(implement_address, initialize_data.data);
  await proxy.deployed()
  console.log("proxy is", proxy.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
