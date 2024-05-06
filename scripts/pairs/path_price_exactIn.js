const { ethers, run } = require('hardhat')

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

  let pathPrice_address = "0xf67394B56827246644359D4A3fc0D817dF8E90c0";

  let pancake_quoterv2 = process.env.PANCAKESWAP_QUOTERV2; 
  let uni_quoterv2 = process.env.UNISWAP_QUOTERV2;
  let sushi_quoterv2 = process.env.SUSHI_QUOTERV2;

  let weth9_address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  let wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  let usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  let usdt_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  let wstETH_address = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0";
  let dai_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  let pepe_address = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";
  
  let fees = [100, 500, 3000, 10000];

  const poolsPrice = await ethers.getContractAt('PoolsPrice', pathPrice_address, signer)

  console.log("UNISWAP V3");
  let path = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result.expectedAmount.toString(), 6));

  let path1 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result1 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path1, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result1.expectedAmount.toString(), 6));

  let path2 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result2 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path2, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result2.expectedAmount.toString(), 6));

  let path3 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result3 = await poolsPrice.callStatic.getExactInAmountOut(uni_quoterv2, path3, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result3.expectedAmount.toString(), 6));


  console.log("PANCAKESWAP V3");
  let path4 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result4 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path4, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result4.expectedAmount.toString(), 6));

  let path5 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result5 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path5, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result5.expectedAmount.toString(), 6));

  let path6 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result6 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path6, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result6.expectedAmount.toString(), 6));

  let path7 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result7 = await poolsPrice.callStatic.getExactInAmountOut(pancake_quoterv2, path7, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result7.expectedAmount.toString(), 6));

  console.log("SUSHI V3");
  let path8 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[0]);
  let result8 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path8, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result8.expectedAmount.toString(), 6));

  let path9 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[1]);
  let result9 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path9, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result9.expectedAmount.toString(), 6));

  let path10 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[2]);
  let result10 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path10, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result10.expectedAmount.toString(), 6));

  let path11 = await poolsPrice.getSinglePath(weth9_address, usdt_address, fees[3]);
  let result11 = await poolsPrice.callStatic.getExactInAmountOut(sushi_quoterv2, path11, ethers.utils.parseEther("1"));
  console.log(ethers.utils.formatUnits(result11.expectedAmount.toString(), 6));

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

