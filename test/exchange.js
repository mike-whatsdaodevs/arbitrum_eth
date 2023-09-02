const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let exchange_address = process.env.EXCHANGE_NEW
  let mfuel_address = process.env.ZWATT_NEW;
  // let zfuel_address = process.env.ZWATT
  // let busd_address = process.env.BUSD
  // const token = await ethers.getContractAt('ZWattToken', zfuel_address, deployer)
  const exchange = await ethers.getContractAt('Exchange', exchange_address, deployer)
  const mfuel = await ethers.getContractAt('ZWattToken', mfuel_address, deployer)
  // const busd = await ethers.getContractAt('ZWattToken', busd_address, deployer)

  let manageTx = await exchange.addManage(deployer.address)
  console.log('manageTx:' + manageTx.hash)
  await manageTx.wait();


  console.log(await exchange.owner())
  return;

  let bal = await mfuel.balanceOf(exchange_address);
  return;

  let setPrice_tx = await exchange.setPrice(ethers.utils.parseEther('100'))
  await setPrice_tx.wait()

  return

  // let busd_approve_tx = await busd.approve(exchange_address, ethers.utils.parseEther("100000"));
  // await busd_approve_tx.wait();

  let swap_tx = await exchange.swap(ethers.utils.parseEther('10'))
  await swap_tx.wait()

  return

  // amount
  let amount = await token.balanceOf(deployer.address)
  console.log('amount:' + amount)

  // totalSupply
  let totalSupply = await token.totalSupply()
  console.log('totalSupply:' + totalSupply)

  // approve
  let approveTx = await token.approve(exchange_address, amount)
  console.log('approveTx:' + approveTx.hash)

  let token_transfer_tx = await token.transfer(exchange_address, ethers.utils.parseEther('100000'))
  await token_transfer_tx.wait()
  console.log('end')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
