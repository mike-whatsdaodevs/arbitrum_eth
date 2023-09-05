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


  let bfuel_address;
  switch (network) {
  case 5 :  
    bfuel_address = process.env.G_bfuel;
    break;
  default: 
    bfuel_address = process.env.LOCAL_bfuel;
  }

  const bfuel = await ethers.getContractAt('BFuelToken', bfuel_address, signer)

  let address = "0xbec9536B52d7977AD2bE0842Db0F74a79c40F010";
  let amount = ethers.utils.parseEther("100000");
  console.log(amount);
  let tx = await bfuel.transfer(address, amount);
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
