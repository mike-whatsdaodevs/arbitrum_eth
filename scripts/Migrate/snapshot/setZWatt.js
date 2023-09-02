const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require("./address/zwatt.js");

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  // let migrate_address = process.env.MIGRATE_TEST
  // let btcz_address = process.env.BTCZ_TEST;
  // let zwatt_address = process.env.ZWATT_TEST;
  // let btcz_old_address = process.env.BTCZ_OLD_TEST;
  // let zwatt_old_address = process.env.ZWATT_OLD_TEST;

  let zwatt_address = process.env.ZWATT_NEW;
  // let btcz_old_address = process.env.BTCZ;
  // let zwatt_old_address = process.env.ZWATT;

  const zwatt = await ethers.getContractAt('ZWattToken', zwatt_address, signer)

 let len = data.length
 console.log("data length", len);

 for(i = 0; i < len; i ++) {
    let addr = data[i][0].trim();
    let zwattEligible = data[i][1].trim();
    let zwatt_amount = ethers.utils.parseEther(zwattEligible);
    console.log("btc_amount is: ", zwattEligible);
    console.log("addr is", addr);
    let send_tx = await zwatt.transfer(addr, zwatt_amount);
    await send_tx.wait();
  }

  return;

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
