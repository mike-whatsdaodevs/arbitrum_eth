const { ethers, run } = require('hardhat')
require('dotenv').config({ path: '.env' })

async function main() {
  await run('compile')

  let provider = ethers.provider
  let signer = provider.getSigner()

  console.log('netWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('netWorks name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log(deployer.address)

  let market_address = process.env.MARKET;
  let btcz_address = process.env.BTCZ;
  let busd_address = process.env.BUSD;

  // MarketPlace deployed to: 0xcCe05351Bd328f29478d0eCc6201574618A4f891
  const market = await ethers.getContractAt('MarketPlace', market_address, signer)
  const token = await ethers.getContractAt('ZWattToken', busd_address, signer)



 

  let data = [
  10871,
  12741,
  17157,
  17148,
];

let length = data.length;

let str = "";
let price_str = "";

for(let i = 0; i < length; i ++) {

  let nft_owner = await market.ownerOf(data[i]);

  console.log(data[i]);
  console.log(nft_owner);

  // if(nft_owner == "0x0000000000000000000000000000000000000000") {
  //     console.log(data[i]);
  //     str = str + data[i] + ",";
  // }

  // let res = await market.getNFT(data[i]);

  // let price = ethers.utils.formatEther(res.price);
  // price_str  = price_str + data[i] + ":" + price + ",";

}
console.log(str);
console.log(price_str);
return;

 

  // let medoTx = await market.setMode(1)
  // console.log('medoTx:' + medoTx.hash)
  // await medoTx.wait()

  // let baseTx = await market.setBaseToken('0x33ddd022fba43df42cd74ab82ac6d1ead7851bd0', true)
  // console.log('baseTx: ' + baseTx.hash)
  // await baseTx.wait()

  // let re = market.isSupportedBaseToken('0x33ddd022fba43df42cd74ab82ac6d1ead7851bd0')
  // console.log('re:' + re)

  // let setNFTTx = await market.setNFT('0x3Ad23805a43AB432d28423D1073bbD3DF2938Be3')
  // console.log('setNFTTx: ' + setNFTTx.hash)
  // await setNFTTx.wait()



  // let uPrice = await market.usdtPrice()
  // let zprice = await market.btczPrice()
  // console.log('uprice:' + uPrice)
  // console.log('zprice:' + zprice)

  // approve
  // let approveTx = await miner.approve(process.env.MARKET, 2)
  // console.log('approveTx:' + approveTx.hash)
  // await approveTx.wait()

  // let sellTx = await market.sell(2, '0x33ddd022fba43df42cd74ab82ac6d1ead7851bd0', 1, ethers.utils.parseEther('10'))
  // console.log('sellTx ' + sellTx.hash)
  // await sellTx.wait()

  // let nft = await market.getNFT(2)
  // console.log(nft.price)

  // let approveTx = await token.approve(process.env.MARKET, ethers.utils.parseEther('200'))
  // console.log('approveTx: ' + approveTx.hash)
  // await approveTx.wait()

  // let buyTx = await market.buy(2, 1)
  // console.log('buyTx ' + buyTx.hash)
  // await buyTx.wait()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
