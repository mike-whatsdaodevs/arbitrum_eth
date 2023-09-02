const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require("./address/btcz.js");

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

  let btcz_address = process.env.BTCZ_NEW;
  // let zwatt_address = process.env.ZWATT_NEW;
  // let btcz_old_address = process.env.BTCZ;
  // let zwatt_old_address = process.env.ZWATT;

  const btcz = await ethers.getContractAt('BTCZToken', btcz_address, signer)

 let len = data.length
 console.log("data length", len);

 for(i = 0; i < len; i ++) {
    let addr = data[i][0].trim();
    let btczEligible = data[i][1].trim();
    let btc_amount = ethers.utils.parseEther(btczEligible);
    console.log("btc_amount is: ", btc_amount);
    console.log("addr is", addr);
    let send_tx = await btcz.transfer(addr, btc_amount);
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
