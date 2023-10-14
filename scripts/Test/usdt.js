const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })
const {data} = require('../list/10-5-100X.js');

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


  let usdt_address;
  switch (network) {
  case 66666 :  
    usdt_address = process.env.B_USDT;
    break;
  case 963 :  
    usdt_address = process.env.M_USDT;
    break;
  default: 
    usdt_address = process.env.LOCAL_USDT;
  }

  console.log(usdt_address);
  const usdt = await ethers.getContractAt('USDT', usdt_address, signer)

  // let addManageTx1 = await usdt.setManage("0xD6C3b1a1b70F1b10d886f4B6964cD225d861dDE0", true);
  // await addManageTx1.wait();
  // console.log(addManageTx1.hash);
  // return;
  let address = "0x06aCe60b5D5cC887a79AC111dEeF88B5453dCAA0";//deployer.address;
  let amount = ethers.utils.parseUnits("0", 6);
  console.log(amount);
  console.log(address);
  return;
  let tx = await usdt.mint(address, amount);
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
