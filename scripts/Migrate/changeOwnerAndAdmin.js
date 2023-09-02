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

  let staking_address = process.env.STAKING_TEST

  // let staking_address = process.env.STAKING_NEW

  let newAdmint = "0xC42578cc94199725FaBd5418C5A4752D36d183D4";

  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer);

  let changeAdmin_tx = await staking.changeAdmin(newAdmint);
  await changeAdmin_tx.wait();

  console.log("set end");


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
