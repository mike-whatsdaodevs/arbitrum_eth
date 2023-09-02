// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  let provider = hre.ethers.provider;
  let signer = provider.getSigner();
  console.log(await signer.getAddress());

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  await hre.run('compile');

  const miner_nft = process.env.MINER;
  let myContract = await hre.ethers.getContractAt("NFTMiner", miner_nft, signer);

  // const filter = {
  //   address: contractAddress,
  //   fromBlock: 18208485,
  //   toBlock: 18208487
  // };
  // const logs = await provider.getLogs(filter);
  // console.log(logs)
  // return;

  // continue to listen log
  myContract.on("Transfer", (from, to, tokenId) => {
      console.log(from, to, tokenId);
  });


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
