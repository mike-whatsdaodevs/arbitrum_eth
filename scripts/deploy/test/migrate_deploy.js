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


  let btcz_address = process.env.BTCZ_NEW;
  let zwatt_address = process.env.ZWATT_NEW;
  let btcz_old_address = process.env.BTCZ;
  let zwatt_old_address = process.env.ZWATT;
  let wallet_address = process.env.WALLET


  const Migrate = await hre.ethers.getContractFactory('Migrate')
  const migrate = await Migrate.deploy();
  await migrate.deployed()

  let implement_address = migrate.address;

  console.log("migrate address is", implement_address);

  const MigrateObj = await hre.ethers.getContractAt('Migrate', implement_address, signer)
  const initialize_data = await MigrateObj.populateTransaction.initialize(
    btcz_address,
    zwatt_address,
    btcz_old_address,
    zwatt_old_address,
    wallet_address
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
