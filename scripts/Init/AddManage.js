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

  let miner_address = process.env.MINER_TEST;
  let repo_address = process.env.REPOS_TEST

  let btcz_mint_address = process.env.BTCZ_MINT1_TEST

  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)
  const property = await ethers.getContractAt('NFTProperty', repo_address, signer)

  // process.env.FACTORY
  let manageMinerTx = await property.addManage(btcz_mint_address)
  console.log('manageMinerTx:' + manageMinerTx.hash)
  await manageMinerTx.wait()

  let manageRepoTx = await miner.addManage(btcz_mint_address)
  console.log('manageRepoTx:' + manageRepoTx.hash)
  await manageRepoTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
