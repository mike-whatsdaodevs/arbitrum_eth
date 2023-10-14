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


  let provider = ethers.provider
  const [deployer] = await ethers.getSigners()
  console.log('deployer:' + deployer.address)

  let overrides = {
    gasPrice: 20000
  }

  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let property_address;
  let bfuel_address;
  switch (network) {
  case 5 :
    property_address = process.env.G_PROPERTY;
    break;
  case 66666 :
    property_address = process.env.B_PROPERTY;
    bfuel_address = process.env.B_BFUEL;
    break;
  case 963 :
    property_address = process.env.M_PROPERTY;
    bfuel_address = process.env.M_BFUEL;
    break;
  default: 
    property_address = process.env.LOCAL_PROPERTY;
  }


  // const BFuelToken = await hre.ethers.getContractFactory('BFuelToken')
  // const bfuel = await BFuelToken.deploy()
  // await bfuel.deployed()
  // console.log("bfuel address :",bfuel.address);


  // const USDT = await hre.ethers.getContractFactory('USDT')
  // const usdt = await USDT.deploy()
  // await usdt.deployed()
  // console.log("usdt address :",usdt.address);
  console.log("property_address address :",property_address);
  console.log("bfuel_address address :",bfuel_address);


  ////  stakingV1
  const StakingV1 = await hre.ethers.getContractFactory('StakingV1')
  const stakingV1 = await StakingV1.deploy()
  await stakingV1.deployed()

  console.log("stakingV1 address is", stakingV1.address);


  let rewardsDuration = 4 * 365 * 60 * 60 * 24

  console.log("property_address is", property_address);

  const initialize_dataV1 = await stakingV1.populateTransaction.initialize(
    bfuel_address,
    property_address,
    rewardsDuration
  );
  console.log("initialize_dataV1 data is",initialize_dataV1)

  const COD20ProxyV1 = await hre.ethers.getContractFactory('COD20Proxy')
  let proxyV1 = await COD20ProxyV1.deploy(stakingV1.address, initialize_dataV1.data);
  await proxyV1.deployed()
  console.log("proxyV1 address is", proxyV1.address);
  return;

  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  const marketPlace = await MarketPlace.deploy(
    usdt.address, 
    deployer.address
  )
  await marketPlace.deployed()

  console.log("bfuel address :",bfuel.address);
  console.log("usdt address :",usdt.address);


  console.log('MarketPlace deployed to:', marketPlace.address)
  console.log('ProxyV1 deployed to:', proxyV1.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
