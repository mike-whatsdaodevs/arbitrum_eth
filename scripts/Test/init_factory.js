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
  let addManageTx1 = await miner1.addManage(factory_address);
  await addManageTx1.wait();

  const miner2 = await ethers.getContractAt('NFTMiner', miner2_address, signer)
  let addManageTx2 = await miner2.addManage(factory_address);
  await addManageTx2.wait();

  const miner3 = await ethers.getContractAt('NFTMiner', miner3_address, signer)
  let addManageTx3 = await miner3.addManage(factory_address);
  await addManageTx3.wait();

  const property = await ethers.getContractAt('NFTProperty', property_address, signer)
  let addManageTx4 = await property.addManage(factory_address);
  await addManageTx4.wait();

  const factory = await ethers.getContractAt('NFTFactory', factory_address, signer)
  let setNFTMinerTx1 = await factory.setNFTMiner(miner1_address, true);
  await setNFTMinerTx1.wait();

  let setNFTMinerTx2 = await factory.setNFTMiner(miner2_address, true);
  await setNFTMinerTx2.wait();

  let setNFTMinerTx3 = await factory.setNFTMiner(miner3_address, true);
  await setNFTMinerTx3.wait();

  console.log("done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
