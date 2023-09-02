const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)
  const staking = await ethers.getContractAt('ZStaking', '0x841737aB4Acd971D13c7591e7e8F025Ff91E8740', signer)

  // start
  // let startTx = await staking.start()
  // console.log('startTx:' + startTx.hash)
  // await startTx.wait()

  let zWattAddressTest = '0x3Cc5BCbd6B41AFCeBfB733FEA1393d14c060446D'
  let zWattAddressMian = '0xFf0ff2Fa960c8337e7E28c2A9aa8be7Fe9a7cbba'
  // let fuelTx = await staking.setMFuelReceiver(zWattAddressTest)
  // console.log('fuelTx:' + fuelTx.hash)
  // await fuelTx.wait()

  // staking
  // let stakingTx = await staking.stake(1)
  // console.log('stakingTx:' + stakingTx.hash)
  // await stakingTx.wait()

  // let consumptionRate = await staking.consumptionRate()
  // console.log('consumptionRate:' + consumptionRate)

  // let earned = await staking.earned(deployer.address)
  // console.log('earned:' + earned)

  // let consumption = await staking.consumption(deployer.address)
  // console.log('consumption:' + consumption)

  // let hashRateOf = await staking.hashRateOf(deployer.address)
  // console.log('hashRateOf:' + hashRateOf)

  // let totalHashRate = await staking.totalHashRate()
  // console.log('totalHashRate:' + totalHashRate)

  let minerAddress = await staking.NFTMiner()
  console.log('minerAddress:' + minerAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
