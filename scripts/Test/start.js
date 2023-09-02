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

  let staking_address = process.env.STAKING_TEST
  let btcz_address = process.env.BTCZ_TEST

  const staking = await ethers.getContractAt('ZStaking', staking_address, signer)
  const token = await ethers.getContractAt('BTCZToken', btcz_address, signer)

  // totalSupply
  let totalSupply = await token.totalSupply()
  console.log('totalSupply:' + totalSupply)

  // amount
  let amount = await token.balanceOf(deployer.address)
  console.log('amount:' + amount)

  // approve

  // start
  let startTx = await staking.start()
  console.log('startTx:' + startTx.hash)
  await startTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
