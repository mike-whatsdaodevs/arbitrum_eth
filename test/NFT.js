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

  let miner_address = process.env.MINER
  const miner = await ethers.getContractAt('NFTMiner', miner_address, signer)


for(let i = 0; i < length; i ++) {
  let owner = await miner.ownerOf(i);


}
  

  // let manageTx = await property.addManage(deployer.address)
  // let manageTx = await miner.addManage(deployer.address)
  // console.log('manageTx: ' + manageTx.hash)
  // await manageTx.wait()

  // let recipient = "0xFf0ff2Fa960c8337e7E28c2A9aa8be7Fe9a7cbba"
  // for (i = 0; i < 10; i++) {
  //   let mintTx = await miner.mint(recipient)
  //   console.log('mintTx: ' + mintTx.hash)
  //   await mintTx.wait()
  // }

  // let baseURI = await miner.baseURI()
  // console.log('baseURI:' + baseURI)

  // let setBaseURITX = await miner.setBaseURI('https://nft.btc-z.org/')
  // console.log('setBaseURITX:' + setBaseURITX.hash)
  // await setBaseURITX.wait()

  // let tokenURI = await miner.tokenURI(11)
  // console.log('tokenURI:' + tokenURI)

  // let tokenURI = await miner.tokenURI(11)
  // console.log('tokenURI:' + tokenURI)

  // approve
  // let approveTx = await miner.approve('0xA21C66a62f340737Aa1F3B9614522B71697a5b4e', 1)
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
