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
  let factory_address = process.env.FACTORY_TEST
  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)

  let block = await provider.getBlock()
  console.log('blockTime:' + block.timestamp)
  let prop = [1000, 10, block.timestamp]

  // 0xAF702571cb3F0b9091C6E6c8B9731705E2ee0804
  // 0x9F6C71dE830F70dFc352F13fE34F351D7fA9B648
  for (var i = 0; i < 3; i++) {
    let tx = await factory.buildMiner(prop, deployer.address)
    console.log(tx.hash)
    await tx.wait()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
