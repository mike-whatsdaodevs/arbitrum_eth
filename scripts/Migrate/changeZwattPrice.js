const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let exchange_address = process.env.EXCHANGE_NEW
  let mfuel_address = process.env.ZWATT_NEW;
  const exchange = await ethers.getContractAt('Exchange', exchange_address, deployer)
  const mfuel = await ethers.getContractAt('ZWattToken', mfuel_address, deployer)

  let bal = await mfuel.balanceOf(exchange_address);
  console.log(bal);

  let setPrice_tx = await exchange.setPrice(ethers.utils.parseEther('50'))
  await setPrice_tx.wait()

  return

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
