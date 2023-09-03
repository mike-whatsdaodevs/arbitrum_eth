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

  let miner1_address = process.env.LOCAL_MINER1;
  let miner2_address = process.env.LOCAL_MINER2;
  let miner3_address = process.env.LOCAL_MINER3;
  let property_address = process.env.LOCAL_PROPERTY;
  let factory_address = process.env.LOCAL_FACTORY;
  
  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)

  let property1 = Array(
      100,
      10, 
      1
  );


  let property2 = Array(
      200,
      20, 
      2
  );

  let buildMinerTx = await factory.batchBuildMiner(miner2_address, property2, deployer.address, 10);
  await buildMinerTx.wait();   


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
