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

  let migrate_address = process.env.MIGRATE_TEST

  let btcz_address = process.env.BTCZ_TEST;
  let zwatt_address = process.env.ZWATT_TEST;
  let btcz_old_address = process.env.BTCZ_OLD_TEST;
  let zwatt_old_address = process.env.ZWATT_OLD_TEST;

  // let btcz_address = process.env.BTCZ_NEW;
  // let zwatt_address = process.env.ZWATT_NEW;
  // let btcz_old_address = process.env.BTCZ;
  // let zwatt_old_address = process.env.ZWATT;

  const migrate = await ethers.getContractAt('Migrate', migrate_address, signer)
  const btcz = await ethers.getContractAt('ZWattToken', btcz_address, signer)
  const zfuel = await ethers.getContractAt('ZWattToken', zwatt_address, signer)
  const btcz_old = await ethers.getContractAt('ZWattToken', btcz_old_address, signer)
  const zfuel_old = await ethers.getContractAt('ZWattToken', zwatt_old_address, signer)


  let my_consumption = await migrate.consumption(deployer.address);
  console.log("my consumption is", my_consumption);

  let my_earned = await migrate.earned(deployer.address);
  console.log("my earned is", my_earned);

  let zfuel_approve_tx = await zfuel.approve(migrate_address, ethers.constants.MaxUint256);
  await zfuel_approve_tx.wait();

  let harvest_tx = await migrate.harvest();
  await harvest_tx.wait();

  console.log("harvest_tx hash is:", harvest_tx.hash);
  return;


  
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
