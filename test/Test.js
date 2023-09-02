const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)
  const test = await ethers.getContractAt('Test', '0x46ec96e66A8379457C19Fa1FB15E2384116D0228', signer)

  // start
  // let startTx = await staking.start()
  // console.log('startTx:' + startTx.hash)
  // await startTx.wait()

  // staking
  // let stakingTx = await staking.stake(1)
  // console.log('stakingTx:' + stakingTx.hash)
  // await stakingTx.wait()

  // let setRate = await test.setRate(10)
  // console.log('setRate:' + setRate.hash)

  let consumptionRate = await test.consumptionRate()
  console.log('consumptionRate:' + consumptionRate)

  let consumption = await test.consumption(deployer.address)
  console.log('consumption:' + consumption)

  let _consumptionOf = await test._consumptionOf(deployer.address)
  console.log('_consumptionOf:' + _consumptionOf)

  let consumptions = await test.consumptions(deployer.address)
  console.log('consumptions:' + consumptions)

  let getConsumptions = await test.getConsumptions(deployer.address)
  console.log('getConsumptions:' + getConsumptions)

  // let consumption = await staking.consumption(deployer.address)
  // console.log('consumption:' + consumption)

  // let hashRateOf = await staking.hashRateOf(deployer.address)
  // console.log('hashRateOf:' + hashRateOf)

  // let totalHashRate = await staking.totalHashRate()
  // console.log('totalHashRate:' + totalHashRate)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
