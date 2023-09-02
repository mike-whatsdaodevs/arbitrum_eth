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

  let repo_address = process.env.REPOS
  const property = await ethers.getContractAt('NFTProperty', repo_address, signer)

  let block = await provider.getBlock()
  console.log('blockTime:' + block.timestamp)
  let prop = [1000000 , 10, block.timestamp]

  for (tokenId = 17510; tokenId <= 17519; tokenId ++) {
     // let addTx = await property.addProperty(tokenId, prop)
     console.log(addTx.hash)
     await addTx.wait();
     let hashRate = await property.getHashRate(tokenId)
     console.log('hashRate:' + hashRate)
  }
 
  // let hashRate = await property.getHashRate(tokenId)
  // // let consumption = await property.getConsumption(5)
  // // let createTime = await property.getCreateTime(5)

  // console.log('hashRate:' + hashRate)
  // console.log('consumption:' + consumption)
  // console.log('createTime::' + createTime)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
