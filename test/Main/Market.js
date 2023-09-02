const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)
  const market = await ethers.getContractAt('MarketPlace', '0x730Df72d7C6BEf4b2739Bb65b2a2B806aAB503A0', signer)

  let busdAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
  let baseTx = await market.setBaseToken(busdAddress, true)
  console.log('baseTx:' + baseTx.hash)
  await baseTx.wait()

  let setNFTTx = await market.setNFT('0x3b703461384Cb5aC2357eF5A3b85c800D1c2fe7a')
  console.log('setNFTTx:' + setNFTTx.hash)
  await setNFTTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
