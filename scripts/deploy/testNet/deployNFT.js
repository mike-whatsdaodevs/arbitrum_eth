// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // We get the contract to deploy


  let provider = ethers.provider
  const [deployer] = await ethers.getSigners()
  console.log('deployer:' + deployer.address)

  
  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);

  let overrides = {
    gasPrice: 20000
  }

  const NFTMiner = await hre.ethers.getContractFactory('NFTMiner')
  const nftMiner1 = await NFTMiner.deploy(
    "ZEON GT1X",
    "ZEON GT1X",
    "https://nft.bitcoincode.technology/zeongt1x/"
  );
  await nftMiner1.deployed()

  const nftMiner2 = await NFTMiner.deploy(
    "ZEON GT10X",
    "ZEON GT10X",
    "https://nft.bitcoincode.technology/zeongt10x/"
  )
  await nftMiner2.deployed()

  const nftMiner3 = await NFTMiner.deploy(
    "ZEON GT100X",
    "ZEON GT100X",
    "https://nft.bitcoincode.technology/zeongt100x/"
  )
  await nftMiner3.deployed();

  const NFTProperty = await hre.ethers.getContractFactory('NFTProperty')
  const property = await NFTProperty.deploy()
  await property.deployed()

  const NFTFactory = await hre.ethers.getContractFactory('NFTFactory')
  const factory = await NFTFactory.deploy(property.address)
  await factory.deployed()

  console.log('NFTMiner1 deployed to:', nftMiner1.address)
  console.log('NFTMiner2 deployed to:', nftMiner2.address)
  console.log('NFTMiner3 deployed to:', nftMiner3.address)

  console.log('NFTProperty deployed to:', property.address)
  console.log('NFTFactory deployed to:', factory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
