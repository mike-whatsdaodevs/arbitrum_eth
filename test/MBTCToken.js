const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('netWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('netWorks name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log(deployer.address)
  const token = await ethers.getContractAt('BTCZToken', process.env.BTCZ, signer)
  let amount = await token.balanceOf('0x9F6C71dE830F70dFc352F13fE34F351D7fA9B648')
  console.log(amount)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
