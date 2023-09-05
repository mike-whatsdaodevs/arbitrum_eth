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


  let sfuel_address;
  switch (network) {
  case 5 :  
    sfuel_address = process.env.G_SFUEL;
    break;
  default: 
    sfuel_address = process.env.LOCAL_SFUEL;
  }

  const sfuel = await ethers.getContractAt('SFuelToken', sfuel_address, signer)

  let address = "0xbec9536B52d7977AD2bE0842Db0F74a79c40F010";
  let amount = ethers.utils.parseEther("100000");
  console.log(amount);
  let tx = await sfuel.transfer(address, amount);
  await tx.wait();
  console.log(tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
