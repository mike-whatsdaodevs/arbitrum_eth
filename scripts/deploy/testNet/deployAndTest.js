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

  const BTCToken = await hre.ethers.getContractFactory('BTCZToken')
  const zBTCToken = await BTCToken.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  await zBTCToken.deployed()

  const ZWattToken = await hre.ethers.getContractFactory('ZWattToken')
  const zWattToken = await ZWattToken.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
  await zWattToken.deployed()

  const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner = await NFTMiner.deploy()
  await nftMiner.deployed()

  const NFTRepository = await hre.ethers.getContractFactory('NFTProperty')
  const repository = await NFTRepository.deploy()
  await repository.deployed()

  let rewardsDuration = 4 * 365 * 60 * 60 * 24
  const MBTCStaking = await hre.ethers.getContractFactory('ZStaking')
  const staking = await MBTCStaking.deploy(zBTCToken.address, zWattToken.address, nftMiner.address, repository.address, rewardsDuration)
  await staking.deployed()

  // BTCZToken deployed to: 0x075F16247a6088e71e38066852a84c5C0Af79285
  // ZFuelToken deployed to: 0x0a10d56DeF659FE90c87651680cA55161A439Cc4
  // NFTMiner deployed to: 0x3b703461384Cb5aC2357eF5A3b85c800D1c2fe7a
  // NFTRepository deployed to: 0xCB3f4B73b2bcD680FAFff2E0F3EC93c6DD21C218
  // NFTFactory deployed to: 0xdaF107Cb6CBc9402F58C266E6632528d38C29612
  // ZStaking deployed to: 0x320Dc99520582cB5556918A9dD96df5dF45b626c

  console.log('BTCZToken deployed to:', zBTCToken.address)
  console.log('ZFuelToken deployed to:', zWattToken.address)
  console.log('NFTMiner deployed to:', nftMiner.address)
  console.log('NFTRepository deployed to:', repository.address)
  console.log('ZStaking deployed to:', staking.address)

  let totalSupply = await zBTCToken.totalSupply()
  console.log('totalSupply:' + totalSupply)

  let approveTx = await zBTCToken.approve(staking.address, totalSupply)
  console.log('approveTx:' + approveTx.hash)

  let manageTx = await nftMiner.addManage(deployer.address)
  console.log('manageTx:' + manageTx.hash)
  await manageTx.wait()

  let mintTx = await nftMiner.mint(deployer.address)
  console.log('mintTx:' + mintTx.hash)
  await mintTx.wait()

  let proManaTx = await repository.addManage(deployer.address)
  console.log('proManaTx:' + proManaTx.hash)
  await proManaTx.wait()

  let block = await provider.getBlock()
  console.log('blockTime:' + block.timestamp)
  let prop = [500000, 10, block.timestamp]
  let addProTx = await repository.addProperty(1, prop)
  console.log('addProTx:' + addProTx.hash)

  let ntfApproTx = await nftMiner.approve(staking.address, 1)
  console.log('ntfApproTx:' + ntfApproTx.hash)
  await ntfApproTx.wait()

  let startTx = await staking.start()
  console.log('startTx:' + startTx.hash)
  await startTx.wait()

  let fuelTx = await staking.setFuelReceiver('0xE13175C36da232ab9AEFc33f841eeC9b697BBf2a')
  console.log('fuelTx:' + fuelTx.hash)
  await fuelTx.wait()

  let stakingTx = await staking.stake(1)
  console.log('stakingTx:' + stakingTx.hash)
  await stakingTx.wait()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
