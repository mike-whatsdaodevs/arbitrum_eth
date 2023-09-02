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

  let btcz_address = process.env.BTCZ_NEW;
  let zwatt_address = process.env.ZWATT_NEW;
  let staking_address = process.env.STAKING_NEW;

  const btcz = await ethers.getContractAt('BTCZToken', btcz_address, signer)
  const zwatt = await ethers.getContractAt('BTCZToken', zwatt_address, signer)
  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer)


  // amount
  // let btcz_stake_amount = await btcz.balanceOf(staking_address)
  // console.log('amount:', ethers.utils.formatEther(btcz_stake_amount))

  // let takeBtcz_tx = await staking.recoverERC20(btcz_address, btcz_stake_amount);
  // await takeBtcz_tx.wait();
  // console.log(takeBtcz_tx.hash);


 
  let zwatt_stake_amount = await zwatt.balanceOf(staking_address);
  console.log('amount:', ethers.utils.formatEther(zwatt_stake_amount))

  let takeZWatt_tx = await staking.recoverERC20(zwatt_address, zwatt_stake_amount);
  await takeZWatt_tx.wait();
  console.log(takeZWatt_tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
