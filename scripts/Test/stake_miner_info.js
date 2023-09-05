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
  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let miner1_address;
  let miner2_address;
  let miner3_address;
  let staking_address;
  let sfuel_address;
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    staking_address = process.env.G_PROXY;
    sfuel_address = process.env.G_SFUEL;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    staking_address = process.env.LOCAL_PROXY;
    sfuel_address = process.env.LOCAL_SFUEL;
  }

  let nftAddr = miner1_address;
  const staking = await ethers.getContractAt('ZStaking', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', nftAddr, signer)
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

  let rewardPerToken = await staking.rewardPerToken();
  console.log("rewardPerToken is", rewardPerToken);

  let consumptionPerToken = await staking.consumptionPerToken();
  console.log("consumptionPerToken is", consumptionPerToken);

  let userRewardPerHashRatePaid = await staking.userRewardPerHashRatePaid(my_address);
  console.log("userRewardPerHashRatePaid is", userRewardPerHashRatePaid)

  let myRewards = await staking.rewards(my_address);
  console.log("my rewards is", myRewards);

  let lastTimeRewardApplicable = await staking.lastTimeRewardApplicable();
  let periodFinish = await staking.periodFinish();
  console.log("lastTimeRewardApplicable is,", lastTimeRewardApplicable);
  console.log("periodFinish is,", periodFinish);


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
