// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  await hre.run('compile');

  let provider = ethers.provider;
  let signer = provider.getSigner();

  let my_address = await signer.getAddress();
  console.log(my_address);

  let implement = "0x6e0fe39cF0B06831bD85988B9EE695e1cAf2cf8d"
  
  let proxy_address = process.env.STAKING_NEW
  // let proxy_address = process.env.STAKING_TEST

  console.log("proxy is", proxy_address);
  
  const proxy = await ethers.getContractAt('ZStakingV2', proxy_address, signer)
  let proxy_upgrade_tx = await proxy.upgradeTo(implement);
  await proxy_upgrade_tx.wait();


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
