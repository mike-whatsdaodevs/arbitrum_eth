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

  let btcz_address = process.env.BTCZ_TEST;
  let zwatt_address = process.env.ZWATT_TEST;
  let btcz_old_address = process.env.BTCZ_OLD_TEST;
  let zwatt_old_address = process.env.ZWATT_OLD_TEST;
  let migrate_address = process.env.MIGRATE_TEST;

  const migrate = await ethers.getContractAt('Migrate', migrate_address, signer)
  const btcz_old = await ethers.getContractAt('ZWattToken', btcz_old_address, signer)
  const zwatt_old = await ethers.getContractAt('ZWattToken', zwatt_old_address, signer)

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

  let take_back_tx = await migrate.takeBackToken(zwatt_address, deployer.address)
  await take_back_tx.wait();
  console.log(take_back_tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
