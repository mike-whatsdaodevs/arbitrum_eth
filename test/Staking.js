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

  const staking = await ethers.getContractAt('ZStaking', process.env.STAKING, signer)
  // const miner = await ethers.getContractAt('NFTMiner', process.env.NFT, signer)
  // const token = await ethers.getContractAt('ZWattToken', process.env.ZWATT, signer)

  // approve
  // let approveTx = await miner.approve(process.env.STAKING, 11)
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()

  // staking
  // let stakingTx = await staking.stake(11)
  // console.log('stakingTx:' + stakingTx.hash)
  // await stakingTx.wait()

  // 1786797694 20220815
  console.log(await staking.periodFinish());

  let myHashRate = await staking.hashRateOf("0xff0ff2fa960c8337e7e28c2a9aa8be7fe9a7cbba")
  console.log('myHashRate is: ', myHashRate)

  let amount = await staking.minerAmountOf("0xff0ff2fa960c8337e7e28c2a9aa8be7fe9a7cbba");
  console.log(amount);
  for(let i = 0 ; i < amount ; i ++) {
    console.log(await staking.minerOfOwnerByIndex("0xff0ff2fa960c8337e7e28c2a9aa8be7fe9a7cbba", i));
  }
  return;


  let earned = await staking.earned('0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  console.log('earned: ' + ethers.utils.formatEther(earned))

  let consumption = await staking.consumption('0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804')
  console.log('consumption: ' + ethers.utils.formatEther(consumption))
  return;
  // amount
  // let amount = await token.balanceOf(deployer.address)
  // console.log('amount: ' + amount)
  // // approve
  // let approveTx = await token.approve(process.env.STAKING, amount)
  // console.log('approveTx: ' + approveTx.hash)
  // await approveTx.wait()

  // let rewardTx = await staking.getReward()
  // console.log('rewardTx: ' + rewardTx.hash)
  // await rewardTx.wait()

  // approve
  // let approveTokenTx = await token.approve(process.env.STAKING, consumption)
  // console.log('approveTokenTx: ' + approveTokenTx.hash)
  // await approveTokenTx.wait()

  let withdrawTx = await staking.withdrawMiner(11)
  console.log('withdrawTx: ' + withdrawTx.hash)
  await withdrawTx.wait()

  // let pauseTx = await staking.pause()
  // console.log('pauseTx:' + pauseTx.hash)
  // await pauseTx.wait()

  let nftStakes = await staking.nftStakes(11)
  console.log('nftStakes:' + nftStakes)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
