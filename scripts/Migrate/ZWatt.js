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


  let AISHIB = "0xd2199c6594a48EbebE53637097356a757d19A948";



  const aishib = await ethers.getContractAt('AISHIB', AISHIB, signer)

  // // amount
  // let zwatt_amount = await zwatt.balanceOf("0x5Fae08257a0deedb4cD6FAa8974754ef39C9681e");
  // console.log('zwatt amount:', ethers.utils.formatEther(zwatt_amount))
  // return;
  let data = [
    "0x99e6994dabf7c762b49c15e6599260d4b90698b3",
    "0x85da49e8b58cd72ac0621e1729c54f0ea34cd5c8",
    "0x4ce8bdc18e257db9ea29d11e290dfba99431ddd9",
    "0xa669c10569c7cd9f1ec7b7536fa0c9499abda77e",
    "0x23cb5c7cd2ceafa8ca2a8fc0cb45aedd34ac9048",
    "0xbba21f8d087d5dca54b7b6954327f9f656095b55",
    "0x2af406c95f0a12d5586292ed8c245e56d5b35938",
    "0x865add835bdff6d817a23062b1a700cd8896dea0",
    "0xf3d9281fa183b74f32b96e1c5244596045f4ede8",
    "0xbfd6b54875a7aae4eb34579bba1f2a16e9521792",
    "0xc7469208cb0a7b631f45c725e254e766df0f9676",
    "0x5dffd11a812579440ff07cf84310ce80f31320cc",
    "0x23eb0dc02e55412ba208e38ae05921df85c6ee08",
    "0xad4ab72de5aac611b56525ba9c6acb35181fc7aa",
    "0xa36ddf023e07f2197453c028454f3488e52c03c2",
    "0x7e82fed4f6a277eb6269cdd3627fe3ca077bf3e2",
    "0xbb4aee67138e890ed8e097ae1271471dc46fe0a2",
    "0x0219fdf164ec10e21298f15a34d456716341cce2",
    "0x5bfec9629eec534eb128df9a2e9db7ab4c7b9497",
    "0x392ff91c81c50777a62a3ef4e965902d4f2bdc59",
    "0xdec3035cf641c64876770e1fddd003237a6a95a4",
    "0x3835cbd60da23e58dab78b35e3196eb0bf8a6a5e",
    "0xf6a0b11a43efc30c08d73743b673739e01a29d2d",
    "0xfbb24426ebf802cd6c316960886cb3c25dcfcfef",
    "0x13b4835dba8ce71a1eed38f6571dded6b826fd04",
    "0x28521a5b7e439d3b0b8e13c5ca66de26cf6e756c",
    "0x07b92243153c0b29f89abf3b512535641d112acb",
    "0xa738cf7ee629bc17c7b2511dc9805902d38b9b62",
    "0x44092cc102dbfcf538b768ab1f028ca3b1e12c50",
    "0xb5f549fd4e2452a8265c79b24226c5b73de1f6c4",
    "0x022ac4a43ee963df4d8e8e52b00ca1dfb13c2673",
    "0x7431931094e8bae1ecaa7d0b57d2284e121f760e",
    "0x311f8bac66051e1a4c1d643f6b7ef6c063a77876",
    "0x248d2f5375135cf82c96fc449a7678963f5ddd11",
    "0x555e965c27ea2f3b7732b1e6b77ac6480a3faa55",
    "0x2834973d4da21e9673fcee4ebdaeba2a72a89b19",
    "0xb6f74e7f0c36d0888976f75966f906dcce39d410",
    "0x5b049c3bef543a181a720dcc6febc9afdab5d377",
    "0x7fe3c0425178ad9ca2b9a87f59b237fbc22585b1",
    "0x00345bb8270bf08b561d0419000f2928e4b97194",
    "0xc441c0048b072890cfda307879f623d25d3327a9",
    "0x32d8bd3caaee7efbb387647762390ff417750fc3",
    "0x5105240f053ca1577010e35037b90a0e25950678",
    "0x89a500ae0097f7f2a124dcdc18d8056bc6d856dc",
    "0x499a1b7cd389033ceb0c7a0fadf5161adc068592",
    "0x1d1543e40353515392491be333f6b66cf72def90",
    "0xb57f1b3282551726d5ff102324dbec5b73ce5972",
    "0x70399b85054dd1d94f2264afc8704a3ee308abaf",
    "0xfe5ea3f4b76dddb46faa80cf099b334e75c0f877",
    "0x4988b2a59c6a50a31d88d165fec9e0f4562ea8f2",
    "0xf39fbf3bd9f7bfda4fd5cb30df587c9f6d6abbbe",
    "0xa82c807c6905218ec443c726100b06f564453ff2",
  ];
  let receive_address;
  for (let i = 0; i < data.length; ++i) {
      receive_address  = data[i];
      console.log(receive_address);
      let transferTx = await aishib.transfer(receive_address, ethers.utils.parseEther("22000000"));
      console.log('transferTx:' + transferTx.hash)
      await transferTx.wait()
  }

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
