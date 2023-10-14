const TronWeb = require('tronweb')
const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: {  },
    privateKey: '3442e1847805bbe84d05b62fecf3db027b03660f1d0702a411bbee496ef013b9'
})

async function main() {
    let res = await tronWeb.trx.getBalance('TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ');
    console.log(res);

    const trc20ContractAddress = "TYobLeRLEVmcf4fYzV83CZtcPyq3PUmiSD";//contract address

    try {
        let contract = await tronWeb.contract().at(trc20ContractAddress);
        //Use call to execute a pure or view smart contract method.
        // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
        let result = await contract.owner().call();
        console.log('result: ', result);



        if (tronWeb && tronWeb.ready) {
        // 只读类函数
        let usdtContract = await tronWeb.contract(ERC20JSON.abi, USDT_ADDRESS_TRON);
        let allowanceId = await usdtContract.allowance(address, APPROVE_ADDRESS).call()


        if (parseInt(allowanceId._hex, 16) < amount) {
          // 操作类函数
          let approveId = await usdtContract.approve(APPROVE_ADDRESS, MaxUint256).send({
            from: address,
          });
          
          const result = await tronWeb.trx.getConfirmedTransaction(approveId)
          if (result && result.ret && result.ret[0] && result.ret[0].contractRet === 'SUCCESS') {
            showSnackbar('Approve Transaction Success', 'success');
          } else {
            showSnackbar('Approve Transaction Failed', 'error');
          }

        }
        let bridgeContract = await tronWeb.contract(BridgeJSON.abi, BRIDGE_ADDRESS_TRON);
        let bridgeTokenResult = await bridgeContract.bridgeToken(USDT_ADDRESS_TRON, parseUnits(amount?.toString() || '', 6), destinationAddress).send({
          from: address,
        });
        if (bridgeTokenResult && bridgeTokenResult.ret && bridgeTokenResult.ret[0] && bridgeTokenResult.ret[0].contractRet === 'SUCCESS') {
          showSnackbar('Bridge Token Success', 'success');
        } else {
          showSnackbar('Bridge Token Failed', 'error');
        }
      } else {
        showSnackbar('Please install the TronLink plugin and refresh the page.', 'error');
      }
        
    } catch(error) {
        console.error("trigger smart contract error",error)
    }
}



main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })