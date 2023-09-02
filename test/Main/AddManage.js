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
  const miner = await ethers.getContractAt('NFTMiner', '0x322D1F74DEfAB8700DdaFC3B3369186f03c81A92', signer)
  const property = await ethers.getContractAt('NFTProperty', '0x0eB2907AB0255a8e4D02E4F0740185aD46400157', signer)

  // let manageTx = await property.addManage(deployer.address)
  let manageMTx = await miner.addManage('0x868736F0dE95C7A2515e073190381c6FEd1FaD77')
  console.log('manageMTx:' + manageMTx.hash)
  await manageMTx.wait()

  // let managePTx = await property.addManage('0x938aD57d0CA61ae3d21C1514Da0345D7Aa02544D')
  // console.log('managePTx:' + managePTx.hash)
  // await managePTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
