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

  // let staking_address = process.env.STAKING_TEST
  // let btcz_address = process.env.BTCZ_TEST
  // let zfuel_address = process.env.ZWATT_TEST

  let proxy_address = process.env.B_PROXYV1;
  let staking_address = "0x90189F1dc1e7F20Be01af6a538c0fFfecc86D2f6";


  const proxy = await ethers.getContractAt('StakingV1', proxy_address, signer)

  let upgradeToTx = await proxy.upgradeTo(staking_address);
  await upgradeToTx.wait();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
