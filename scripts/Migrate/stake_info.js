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

  let my_address = "0x4b415c90cEBDa64779F0AcE4bef3A475129B2Fce";//deployer.address;

  // let staking_address = process.env.STAKING_TEST
  // let miner_address = process.env.MINER_TEST
  // let zfuel_address = process.env.ZWATT_TEST

  let staking_address = process.env.STAKING
  let miner_address = process.env.MINER
  let zfuel_address = process.env.ZWATT
  let wallet = process.env.WALLET

  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)
  const token = await ethers.getContractAt('ZWattToken', zfuel_address, signer)


  // let transferOwnership_tx = await staking.transferOwnership(wallet)

  // console.log(transferOwnership_tx.hash);

  // await transferOwnership_tx.wait();
    
  // // // // // staking
  // amount
  let amount = await token.balanceOf(my_address)
  console.log('amount: ' + amount)

  let rewardRate = await staking.rewardRate()
  console.log('rewardRate: ' + ethers.utils.formatEther(rewardRate))

  let earned = await staking.earned(my_address)
  console.log('earned: ', ethers.utils.formatEther(earned.toString()));

  let consumption = await staking.consumption(my_address)
  console.log('consumption: ' , ethers.utils.formatEther(consumption.toString()))

  let minerAmount = await staking.minerAmountOf(my_address)
  console.log('minerAmount: ' + minerAmount)

  let totalHashRate = await staking.totalHashRate()
  console.log('totalHashRate is: ', totalHashRate)

    let myHashRate = await staking.hashRateOf(my_address)
  console.log('myHashRate is: ', myHashRate)

  for(let i = 0; i < minerAmount; i ++) {
    let miner_id = await staking.minerOfOwnerByIndex(my_address, i);
    console.log("miner_id is", miner_id);
   
  }


  // amount
  // let amount = await token.balanceOf(deployer.address)
  // console.log('amount: ' + amount)
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
