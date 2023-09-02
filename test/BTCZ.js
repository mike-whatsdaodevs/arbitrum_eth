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

  let btcz_address = process.env.BTCZ;
  let staking_address = process.env.STAKING;


  const token = await ethers.getContractAt('ZWattToken', btcz_address, signer)

  // amount
  let amount = await token.balanceOf(staking_address)
  console.log('amount:', ethers.utils.formatEther(amount))

  return;
  // totalSupply
  // let totalSupply = await token.totalSupply()
  // console.log('totalSupply:' + totalSupply)

  // approve
  // let approveTx = await token.approve('0xA21C66a62f340737Aa1F3B9614522B71697a5b4e', amount)
  // console.log('approveTx:' + approveTx.hash)

  // let transferTx = await token.transfer(wallet, amount)
  // console.log('transferTx:' + transferTx.hash)
  // await transferTx.wait()


  // let transferOwnership_tx = await token.transferOwnership(wallet)

  // console.log(transferOwnership_tx.hash);

  // await transferOwnership_tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
