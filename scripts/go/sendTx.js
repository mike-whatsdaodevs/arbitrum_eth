const sdk = require('api')('@tron/v4.7.2#19cpcn4pollds6o2o');

sdk.triggerconstantcontract1({
  owner_address: 'TSNEe5Tf4rnc9zPMNXfaTF5fZfHDDH8oyW',
  contract_address: 'TUZvR27aGDTjenuxuXEpdbtoNtHU7i2PoE',
  function_selector: 'bridgeToken(address,uint256,address)',
  parameter: '000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c',
  visible: true
})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));