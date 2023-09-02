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

  const ZWattToken = await hre.ethers.getContractFactory('ZWattToken')
  const zWattToken = await ZWattToken.deploy(deployer.address, deployer.address)
  await zWattToken.deployed()

  console.log(zWattToken.address)


  const BTCToken = await hre.ethers.getContractFactory('BTCZToken')
  const zBTCToken = await BTCToken.deploy(deployer.address)
  await zBTCToken.deployed()


  console.log("zWatt address :",zWattToken.address)

  console.log("btcz address :",zBTCToken.address)

  // const ZWattToken = await hre.ethers.getContractFactory('ZWattToken')
  // const zWattToken = await ZWattToken.deploy('0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804', '0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  // await zWattToken.deployed()

  const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner = await NFTMiner.deploy()
  await nftMiner.deployed()

  const NFTRepository = await hre.ethers.getContractFactory('NFTProperty')
  const repository = await NFTRepository.deploy()
  await repository.deployed()

  const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  const factory = await NFTFactory.deploy(nftMiner.address, repository.address)
  await factory.deployed()

  // let rewardsDuration = 4 * 365 * 60 * 60 * 24
  // const MBTCStaking = await hre.ethers.getContractFactory('ZStaking')
  // const staking = await MBTCStaking.deploy(zBTCToken.address, zWattToken.address, nftMiner.address, repository.address, rewardsDuration)
  // await staking.deployed()

  let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  const marketPlace = await MarketPlace.deploy(busdAddress, zBTCToken.address, nftMiner.address, '0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  await marketPlace.deployed()

  // BTCZToken deployed to: 0x185CA9c26C4969459972C475a5F4C7050c6eEC73
  // ZWattToken deployed to: 0x33ddD022FBA43DF42cD74aB82ac6D1eAd7851bD0
  // NFTMiner deployed to: 0x2c4A9a3fbCa6e5454d68D5286Cae506069a5dAa8
  // NFTRepository deployed to: 0x18951cB3AE0653e9244077fBc15a809701959dD8
  // NFTFactory deployed to: 0x46407Aa9bBd7A56077442f0B38103041C8951D9E
  // ZStaking deployed to: 0x30369e9eC10509574Aa24cB1393AB5Ca4CbfF770
  // MarketPlace deployed to: 0x0EE9FDb3488FCeb675D5b0BcFffB7079CA627F39

  console.log('BTCZToken deployed to:', zBTCToken.address)
  console.log('ZWattToken deployed to:', zWattToken.address)
  console.log('NFTMiner deployed to:', nftMiner.address)
  console.log('NFTRepository deployed to:', repository.address)
  console.log('NFTFactory deployed to:', factory.address)
//  console.log('ZStaking deployed to:', staking.address)
  console.log('MarketPlace deployed to:', marketPlace.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
