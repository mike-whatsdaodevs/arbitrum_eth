// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const {ethers} = require("hardhat");

async function main(){
    
    let provider = ethers.provider;
    let signer = provider.getSigner();

    let my_address = await signer.getAddress();
    console.log(my_address);
    await run("compile");
    console.log("networks ID is ", (await ethers.provider.getNetwork()).chainId)
    console.log("networks name is ", (await ethers.provider.getNetwork()).name)    

    const miner_mint = process.env.MINT
    const minermint = await ethers.getContractAt("MinerMint", miner_mint, signer)


    const mint_tx = await minermint.changeWallet(wallet);    
    await mint_tx.wait();
   
  }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
