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

  let btcz_address = process.env.BTCZ_NEW;
  let staking_address = process.env.STAKING_NEW;
  let migrate_address = process.env.MIGRATE;


  let old_btcz_address = process.env.BTCZ;
  let old_staking_address = process.env.STAKING;

  const btcz = await ethers.getContractAt('BTCZToken', btcz_address, signer)
  const btcz_old = await ethers.getContractAt('BTCZToken', old_btcz_address, signer)

  // amount
  let btcz_amount_1 = await btcz.balanceOf(deployer.address)
  console.log('amount:', ethers.utils.formatEther(btcz_amount_1))

  return;

  let transferTx = await btcz.transfer(staking_address, ethers.utils.parseEther("19000000"));
  console.log('transferTx:' + transferTx.hash)
  await transferTx.wait()

  let amount = await btcz.balanceOf(staking_address);
  console.log('amount:', ethers.utils.formatEther(amount))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
