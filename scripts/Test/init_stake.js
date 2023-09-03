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

  let staking_address = process.env.LOCAL_PROXY;
  let miner1_address = process.env.LOCAL_MINER1;
  let miner2_address = process.env.LOCAL_MINER2;
  let miner3_address = process.env.LOCAL_MINER3;
  let btcc_address = process.env.LOCAL_BTCC

  const staking = await ethers.getContractAt('ZStaking', staking_address, signer)
  const miner = await ethers.getContractAt('NFTMiner', miner1_address, signer)
  const token = await ethers.getContractAt('BTCCToken', btcc_address, signer)

  let approve_miner_Tx = await miner.setApprovalForAll(staking_address, true)
  console.log('approveTx:' + approve_miner_Tx.hash)
  await approve_miner_Tx.wait()

  let setSFuelReciveerTx = await staking.setFuelReceiver(deployer.address);
  await setSFuelReciveerTx.wait();

  // approve
  let approveTokenTx = await token.approve(staking_address, ethers.constants.MaxUint256);
  await approveTokenTx.wait();


  let setNFTMinerTx1 = await staking.setNFTStatus(miner1_address, true);
  await setNFTMinerTx1.wait();

  let setNFTMinerTx2 = await staking.setNFTStatus(miner2_address, true);
  await setNFTMinerTx2.wait();

  let setNFTMinerTx3 = await staking.setNFTStatus(miner3_address, true);
  await setNFTMinerTx3.wait();


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
