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
  let btcz_old_address = process.env.BTCZ;
  let zwatt_old_address = process.env.BTCZ;
  let exchange_address = process.env.EXCHANGE_NEW;

  const exchange = await ethers.getContractAt('Exchange', exchange_address, signer)


  let take_back_tx = await exchange.takeBackZfuel(deployer.address)
  await take_back_tx.wait();
  console.log(take_back_tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
