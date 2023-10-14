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

  const [deployer] = await ethers.getSigners()
  console.log('deployer:' + deployer.address)

  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let bfuel_address;
  switch (network) {
  case 5 :
    bfuel_address = process.env.G_BFUEL;
    break;
  case 66666 :
    bfuel_address = process.env.B_BFUEL;
    break;
  case 963 :
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    bfuel_address = process.env.LOCAL_BFUEL;
  }


  const Exchange = await hre.ethers.getContractFactory('Exchange')
  const exchange = await Exchange.deploy()
  await exchange.deployed()
  console.log('exchange deployed to:', exchange.address);

  const ex = await hre.ethers.getContractAt('Exchange', exchange.address, deployer)
  const initialize_data = await ex.populateTransaction.initialize(
    bfuel_address,
    deployer.address
  );
  console.log("initialize_data data is",initialize_data)

  const COD20Proxy = await hre.ethers.getContractFactory('COD20Proxy')
  let proxy = await COD20Proxy.deploy(exchange.address, initialize_data.data);
  await proxy.deployed()
  console.log("proxy address is", proxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
