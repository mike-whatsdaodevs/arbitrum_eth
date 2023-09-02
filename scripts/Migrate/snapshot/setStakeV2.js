const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require("./address/stake.js");

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let staking_address = process.env.STAKING_NEW

  const staking = await ethers.getContractAt('ZStakingV2', staking_address, signer)


 let len = data.length
 console.log("data length", len);

 let addrs = [];
 let consumptions = [];
 let earneds = [];

 let max = 100000000;

 for(i = 0; i < len; i ++) {
    let addr = data[i][0].trim();
    let earned = data[i][1].trim();
    let consumption = data[i][2].trim();

    console.log("addr address=", addr);
    console.log("consumption is=", consumption);
    console.log("earned is=", earned);

    if(earned > max) {
      console.log("error addr is:", addr);
      console.log("error eran is:", earned);
      return;
    }

    addrs[i] = addr;
    consumptions[i] = ethers.utils.parseEther(consumption)
    earneds[i] = ethers.utils.parseEther(earned);
    console.log("addr is:", addr);
  }


  const set_tx = await staking.batchMinedAdd(addrs, earneds, consumptions);    
  await set_tx.wait();
  console.log("tx is", set_tx.hash);

  let my_consumption = await staking.consumption(addrs[0]);
  console.log("my consumption is", my_consumption);

  let my_earned = await staking.earned(addrs[0]);
  console.log("my earned is", my_earned);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
