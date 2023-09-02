const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)
  const token = await ethers.getContractAt('BTCZToken', '0x9Be6760c7F478e6d8C4aeCABcB75fe032FE49276', signer)

  // amount
  let amount = await token.balanceOf(deployer.address)
  console.log('amount:' + amount)

  // totalSupply
  let totalSupply = await token.totalSupply()
  console.log('totalSupply:' + totalSupply)

  // approve
  let approveTx = await token.approve('0x841737aB4Acd971D13c7591e7e8F025Ff91E8740', amount)
  console.log('approveTx:' + approveTx.hash)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
