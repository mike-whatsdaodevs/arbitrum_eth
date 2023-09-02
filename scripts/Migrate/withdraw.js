const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  // let staking_address = process.env.STAKING_TEST
  // let miner_address = process.env.MINER_TEST
  // let zfuel_address = process.env.ZWATT_TEST

  let staking_address = process.env.STAKING_NEW
  let miner_address = process.env.MINER
  let zfuel_address = process.env.ZWATT_NEW
  let wallet = process.env.WALLET

  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)
  const token = await ethers.getContractAt('ZWattToken', zfuel_address, signer)


  // let transferOwnership_tx = await staking.transferOwnership(wallet)

  // console.log(transferOwnership_tx.hash);

  // await transferOwnership_tx.wait();
    
 

  // console.log(ethers.utils.parseEther("1"));

  // let BASE_DIVIDER = await staking.BASE_DIVIDER()
  // console.log("BASE_DIVIDER is", BASE_DIVIDER)

  // let zFuelRate = await staking.zFuelRate()
  // console.log("zFuelRate is", zFuelRate)

  // let FIRST_EPOCH_REWARDS = await staking.FIRST_EPOCH_REWARDS()
  // console.log(FIRST_EPOCH_REWARDS);


  // let withdrawAllMinersTx = await staking.withdrawAllMiners()
  // console.log('withdrawAllMinersTx:' + withdrawAllMinersTx.hash)
  // await withdrawAllMinersTx.wait()

  // return;

 
  let earned = await staking.earned(deployer.address)
  console.log('earned: ', ethers.utils.formatEther(earned))

  let consumption = await staking.consumption(deployer.address)
  console.log('consumption: ' , ethers.utils.formatEther(consumption));

  // let minerAmountOf = await staking.minerAmountOf(deployer.address)
  // console.log('minerAmountOf: ' + minerAmountOf)

  // // amount
  // // let amount = await token.balanceOf(deployer.address)
  // // console.log('amount: ' + amount)
  // // approve

  // let approveTx = await token.approve(staking_address, ethers.constants.MaxUint256)
  // console.log('approveTx: ' + approveTx.hash)
  // await approveTx.wait()

  // let rewardTx = await staking.getReward()
  // console.log('rewardTx: ' + rewardTx.hash)
  // await rewardTx.wait()


  // let earned1 = await staking.earned(deployer.address)
  // console.log('earned: ', ethers.utils.formatEther(earned1))

  // let consumption1 = await staking.consumption(deployer.address)
  // console.log('consumption: ' , ethers.utils.formatEther(consumption1))
  // return;

  let tokenId = 23046
  // let owner = await staking.minerOwnerOf(tokenId);
  // console.log("owner is", owner);

  let withdrawTx = await staking.withdrawMiner(tokenId)
  console.log('withdrawTx:' + withdrawTx.hash)
  await withdrawTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
