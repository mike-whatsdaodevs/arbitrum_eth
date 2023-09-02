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

  // ZStaking
  let btcz_address = process.env.BTCZ_TEST;
  let zwatt_address = process.env.ZWATT_TEST;
  let miner_address = process.env.MINER_TEST;
  let repo_address = process.env.REPOS_TEST;
  let busd_address = process.env.BUSD_TEST;

  // let btcz_address = process.env.BTCZ;
  // let zwatt_address = process.env.ZWATT;
  // let miner_address = process.env.MINER;
  // let repo_address = process.env.REPOS;


  const MinerMint = await hre.ethers.getContractFactory('MinerMint')
  const miner_mint = await MinerMint.deploy()
  await miner_mint.deployed()

  console.log("miner_mint implement address is:", miner_mint.address)

  let miner_mint_address = miner_mint.address;

  const ZStaking = await hre.ethers.getContractAt('ZStakingMigrate', zstaking_address, signer)
  const initialize_data = await ZStaking.populateTransaction.initialize(
    btcz_address, 
    zwatt_address,
    miner_address, 
    repo_address, 
    rewardsDuration
  )
  console.log("initialize data is",initialize_data)

  const BTCZProxy = await hre.ethers.getContractFactory('BTCZProxy')
  let proxy = await BTCZProxy.deploy(zstaking_address, initialize_data.data)
  await proxy.deployed()
  console.log("proxy is", proxy.address);

  // await hre.run("verify:verify", {
  //   address: proxy.address,
  //   contract: "contracts/BTCZProxy.sol:BTCZProxy",
  //   constructorArguments: [
  //       zstaking_address,
  //       hre.ethers.utils.arrayify(initialize_data)
  //     ],
  //   }
  // );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
