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

  const network = (await ethers.provider.getNetwork()).chainId;
  console.log(network);


  let miner1_address;
  let miner2_address;
  let miner3_address;
  let property_address;
  let factory_address;
  switch (network) {
  case 5 :
    miner1_address = process.env.G_MINER1;
    miner2_address = process.env.G_MINER2;
    miner3_address = process.env.G_MINER3;
    property_address = process.env.G_PROPERTY;
    factory_address = process.env.G_FACTORY;
    break;
  default: 
    miner1_address = process.env.LOCAL_MINER1;
    miner2_address = process.env.LOCAL_MINER2;
    miner3_address = process.env.LOCAL_MINER3;
    property_address = process.env.LOCAL_PROPERTY;
    factory_address = process.env.LOCAL_FACTORY;
  }

  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)

  let property1 = Array(
      1_000,
      10, 
      1
  );


  let property2 = Array(
      10_000,
      100, 
      2
  );

  let property3 = Array(
      100_000,
      1000, 
      3
  );

  let receiver = deployer.address;
  let buildMinerTx = await factory.batchBuildMiner(miner3_address, property3, receiver, 10);
  await buildMinerTx.wait();   


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
