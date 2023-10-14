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

  const WBTCC = await hre.ethers.getContractFactory('WBTCC')
  const wbtcc = await WBTCC.deploy()
  await wbtcc.deployed()
  console.log("wbtcc address :",wbtcc.address);

  const WBTC = await hre.ethers.getContractFactory('WBTC')
  const wbtc = await WBTC.deploy()
  await wbtc.deployed()
  console.log("wbtc address :",wbtc.address);

  const BFuelToken = await hre.ethers.getContractFactory('BFuelToken')
  const bfuel = await BFuelToken.deploy(deployer.address, deployer.address)
  await bfuel.deployed()
  console.log("bfuel address :",bfuel.address);

  const BTCCToken = await hre.ethers.getContractFactory('BTCCToken')
  const btcc = await BTCCToken.deploy(deployer.address)
  await btcc.deployed()

  const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner1 = await NFTMiner.deploy(
    "ZEON GT1X",
    "ZEON GT1X",
    "https://nft.bitcoincode.technology/zeongt1x/"
  );
  await nftMiner1.deployed()

  const nftMiner2 = await NFTMiner.deploy(
    "ZEON GT10X",
    "ZEON GT10X",
    "https://nft.bitcoincode.technology/zeongt10x/"
  )
  await nftMiner2.deployed()

  const nftMiner3 = await NFTMiner.deploy(
    "ZEON GT100X",
    "ZEON GT100X",
    "https://nft.bitcoincode.technology/zeongt100x/"
  )
  await nftMiner3.deployed();

  console.log(nftMiner1.address);

  console.log(nftMiner2.address);

  console.log(nftMiner3.address);

  const NFTProperty = await hre.ethers.getContractFactory('NFTProperty')
  const property = await NFTProperty.deploy()
  await property.deployed()

  const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  const factory = await NFTFactory.deploy(property.address)
  await factory.deployed()

  /////// stakeing
  const Staking = await hre.ethers.getContractFactory('Staking')
  const staking = await Staking.deploy()
  await staking.deployed()
  console.log("staking address is", staking.address);

  let rewardsDuration = 4 * 365 * 60 * 60 * 24
  // const stakingObj = await hre.ethers.getContractAt('Staking', staking, signer)
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

  console.log("proxy address is", proxy.address);

  ////  stakingV1
  const StakingV1 = await hre.ethers.getContractFactory('StakingV1')
  const stakingV1 = await StakingV1.deploy()
  await stakingV1.deployed()

  console.log("stakingV1 address is", stakingV1.address);

  // const stakingObj = await hre.ethers.getContractAt('Staking', staking, signer)
  const initialize_dataV1 = await stakingV1.populateTransaction.initialize(
    bfuel.address,
    property.address,
    rewardsDuration
  );
  console.log("initialize_dataV1 data is",initialize_dataV1)

  const COD20ProxyV1 = await hre.ethers.getContractFactory('COD20Proxy')
  let proxyV1 = await COD20ProxyV1.deploy(stakingV1.address, initialize_dataV1.data);
  await proxyV1.deployed()
  console.log("proxyV1 address is", proxyV1.address);

  let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  const marketPlace = await MarketPlace.deploy(busdAddress, '0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
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
  console.log('ProxyV1 deployed to:', proxyV1.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
