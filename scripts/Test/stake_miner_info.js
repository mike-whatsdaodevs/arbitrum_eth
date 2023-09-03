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

  let my_address = deployer.address;

  let staking_address = process.env.LOCAL_PROXY;
  let miner1_address = process.env.LOCAL_MINER1;
  let miner2_address = process.env.LOCAL_MINER2;
  let miner3_address = process.env.LOCAL_MINER3;
  let sfuel_address = process.env.LOCAL_SFUEL;
  let wallet = process.env.WALLET

  const staking = await ethers.getContractAt('ZStaking', staking_address, signer)
  const miner1 = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  const sfuel = await ethers.getContractAt('SFuelToken', sfuel_address, signer)

  // // // // // staking

  let rewardRate = await staking.rewardRate()
  console.log('rewardRate: ' + rewardRate)

  let earned = await staking.earned(my_address)
  console.log('earned: ', ethers.utils.formatEther(earned.toString()));

  let consumption = await staking.consumption(my_address)
  console.log('consumption: ' , ethers.utils.formatEther(consumption.toString()))

  let miner1AmountOf = await staking.minerAmountOf(miner1_address, my_address)
  console.log('miner1AmountOf: ' + miner1AmountOf)

  let miner2AmountOf = await staking.minerAmountOf(miner2_address, my_address)
  console.log('miner2AmountOf: ' + miner2AmountOf)


  let miner3AmountOf = await staking.minerAmountOf(miner3_address, my_address)
  console.log('miner3AmountOf: ' + miner3AmountOf)

  let totalHashRate = await staking.totalHashRate()
  console.log('totalHashRate is: ', totalHashRate)

  let myHashRate = await staking.hashRateOf(my_address)
  console.log('myHashRate is: ', myHashRate)


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

  // return;

  // approve
  // let approveTokenTx = await token.approve(process.env.STAKING, consumption)
  // console.log('approveTokenTx:' + approveTokenTx.hash)
  // await approveTokenTx.wait()

  // let withdrawTx = await staking.withdrawMiner(4)
  // console.log('withdrawTx:' + withdrawTx.hash)
  // await withdrawTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
