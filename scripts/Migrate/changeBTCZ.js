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
  let staking_address = process.env.STAKING_NEW

  const stake = await ethers.getContractAt('ZStakingV2', staking_address, signer)

  // console.log("old btcz is", await stake.BTCZ());
  // console.log("btcz is",btcz_address);

  let change_btcz_tx = await stake.setBTCZ(btcz_address);
  await change_btcz_tx.wait();
  console.log("new btcz is", await stake.BTCZ());

  // let change_reward_btcz = await stake.rewardsAdd(
  //     deployer.address, 
  //     ethers.utils.parseEther("10000"),
  //     true
  // );
  // await change_reward_btcz.wait();



  // let change_zwatt_tx = await stake.batchConsumptionsAdd(
  //   [deployer.address],
  //   [ethers.utils.parseEther("10000")],
  //   true
  //   );

  // await change_zwatt_tx.wait();

  // approve
  // let approveTx = await btcz_old.approve(migrate_address, ethers.constants.MaxUint256);
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()
  // let btcz_exchange_tx = await migrate.exchangeBTCZ();
  // await btcz_exchange_tx.wait();

  // let approveTx = await zwatt_old.approve(migrate_address, ethers.constants.MaxUint256);
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()
  // let zwatt_exchange_tx = await migrate.exchangeZFuel();
  // await zwatt_exchange_tx.wait();
  // console.log(zwatt_exchange_tx.hash);
  // let manage_tx = await migrate.addManage(deployer.address);
  // await manage_tx.wait();

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
