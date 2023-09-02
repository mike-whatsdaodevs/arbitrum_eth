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

  // 0x4BE6339E1480761e650D2F2Eb27a702dD458654A
  let provider = ethers.provider
  const [signer] = await ethers.getSigners()
  let my_address = signer.address;
  console.log('my_address is:', my_address)


  let feeAddress = process.env.WALLET;
  let minerAddress = '0x322D1F74DEfAB8700DdaFC3B3369186f03c81A92'
  let repositoryAddress = '0xCB7D98455E0E8f0dBb65fBE715884B0761241f58'
  let deployerAddress = my_address

  console.log("wallet is", feeAddress);

  const BTCToken = await hre.ethers.getContractFactory('BTCZToken')
  const zBTCToken = await BTCToken.deploy(deployerAddress)
  await zBTCToken.deployed()
  console.log('BTCZToken deployed to:', zBTCToken.address)
  return;

  const ZWattToken = await hre.ethers.getContractFactory('ZWattToken')
  const zWattToken = await ZWattToken.deploy(deployerAddress, feeAddress)
  await zWattToken.deployed()
   console.log('zWattToken deployed to:', zWattToken.address)

   return;

  // const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  // const nftMiner = await NFTMiner.deploy()
  // await nftMiner.deployed()

  // const NFTRepository = await hre.ethers.getContractFactory('NFTProperty')
  // const repository = await NFTRepository.deploy()
  // await repository.deployed()

  // const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  // const factory = await NFTFactory.deploy(nftMiner.address, repository.address)
  // await factory.deployed()

  // let rewardsDuration = 4 * 365 * 60 * 60 * 24

  // const MBTCStaking = await hre.ethers.getContractFactory('ZStaking1')
  // // const staking = await MBTCStaking.deploy('0x9Be6760c7F478e6d8C4aeCABcB75fe032FE49276', '0x54C020fd58b112e185ab22B29012dBe1A3612695', nftMiner.address, repository.address, rewardsDuration)
  // // const staking = await MBTCStaking.deploy(zBTCToken.address, zWattToken.address, minerAddress, repositoryAddress, rewardsDuration)
  // const staking = await MBTCStaking.deploy(zBTCToken.address, zWattToken.address, nftMiner.address, repository.address, rewardsDuration)
  // await staking.deployed()

  // let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  // const MarketPlace = await hre.ethers.getContractFactory('MarketPlace')
  // const marketPlace = await MarketPlace.deploy(busdAddress, zBTCToken.address, nftMiner.address, feeAddress)
  // // const marketPlace = await MarketPlace.deploy(busdAddress, zBTCToken.address, minerAddress, feeAddress)
  // await marketPlace.deployed()

  // const Exchange = await hre.ethers.getContractFactory('Exchange')
  // const exchange = await Exchange.deploy(busdAddress, zWattToken.address, feeAddress)
  // await exchange.deployed()

  console.log('BTCZToken deployed to:', zBTCToken.address)
  console.log('zWattToken deployed to:', zWattToken.address)
  // console.log('NFTMiner deployed to:', nftMiner.address)
  // console.log('NFTRepository deployed to:', repository.address)
  // console.log('NFTFactory deployed to:', factory.address)
  // console.log('ZStaking deployed to:', staking.address)
  // console.log('MarketPlace deployed to:', marketPlace.address)
  // console.log('exchange deployed to:', exchange.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
