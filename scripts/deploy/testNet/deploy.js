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

  const BFuelToken = await hre.ethers.getContractFactory('BFuelToken')
  const bfuel = await BFuelToken.deploy(deployer.address, deployer.address)
  await bfuel.deployed()
  console.log("bfuel address :",bfuel.address);

  const BTCCToken = await hre.ethers.getContractFactory('BTCCToken')
  const btcc = await BTCCToken.deploy(deployer.address)
  await btcc.deployed()

  const NFTMiner1 = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner1 = await NFTMiner1.deploy()
  await nftMiner1.deployed()

  const NFTMiner2 = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner2 = await NFTMiner2.deploy()
  await nftMiner2.deployed()

  const NFTMiner3 = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner3 = await NFTMiner3.deploy()
  await nftMiner3.deployed()

  const NFTProperty = await hre.ethers.getContractFactory('NFTProperty')
  const property = await NFTProperty.deploy()
  await property.deployed()

  const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  const factory = await NFTFactory.deploy(property.address)
  await factory.deployed()

  const ZStaking = await hre.ethers.getContractFactory('ZStaking')
  const staking = await ZStaking.deploy()
  await staking.deployed()

  let rewardsDuration = 4 * 365 * 60 * 60 * 24
  // const stakingObj = await hre.ethers.getContractAt('ZStaking', staking, signer)
  const initialize_data = await staking.populateTransaction.initialize(
    btcc.address,
    bfuel.address,
    property.address,
    rewardsDuration
  );
  console.log("initialize data is",initialize_data)

  const COD20Proxy = await hre.ethers.getContractFactory('COD20Proxy')
  let proxy = await COD20Proxy.deploy(staking.address, initialize_data.data);
  await proxy.deployed()

  let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  const marketPlace = await MarketPlace.deploy(busdAddress, btcc.address, nftMiner1.address, '0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  await marketPlace.deployed()

  console.log("bfuel address :",bfuel.address);
  console.log("btcc address :",btcc.address);

  console.log('NFTMiner1 deployed to:', nftMiner1.address)
  console.log('NFTMiner2 deployed to:', nftMiner2.address)
  console.log('NFTMiner3 deployed to:', nftMiner3.address)

  console.log('NFTProperty deployed to:', property.address)
  console.log('NFTFactory deployed to:', factory.address)
  console.log('MarketPlace deployed to:', marketPlace.address)
  console.log('Proxy deployed to:', proxy.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
