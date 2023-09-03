const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let miner1_address = process.env.LOCAL_MINER1;
  let miner2_address = process.env.LOCAL_MINER2;
  let miner3_address = process.env.LOCAL_MINER3;
  let property_address = process.env.LOCAL_PROPERTY;
  let factory_address = process.env.LOCAL_FACTORY;
  
  const miner1 = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  let balance = await miner1.balanceOf(deployer.address);
  console.log(balance);

  let owner = await miner1.ownerOf(1);
  console.log(owner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
