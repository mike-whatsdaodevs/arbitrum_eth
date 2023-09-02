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
  // let btcz_address = process.env.BTCZ_TEST
  // let zfuel_address = process.env.ZWATT_TEST

  let staking_address = process.env.STAKING_NEW
  let btcz_address = process.env.BTCZ_NEW
  let zfuel_address = process.env.ZWATT_NEW
  let wallet = process.env.WALLET;


  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer)

  let set_setFuelReceiver_tx = await staking.setFuelReceiver(wallet);
  await set_setFuelReceiver_tx.wait();
  let fuelReceiver = await staking.fuelReceiver();
  console.log(fuelReceiver);

  // start
  let startTx = await staking.start()
  console.log('startTx:' + startTx.hash)
  await startTx.wait()

  let setZFuelAddress_tx = await staking.setZFuelAddress(zfuel_address);
  await setZFuelAddress_tx.wait();
  console.log("set");

  // initEndTime
  let init_finish_tx = await staking.setPeriodFinishTime(1786797694)
  console.log('init_finish:' + init_finish_tx.hash)
  await init_finish_tx.wait()

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
