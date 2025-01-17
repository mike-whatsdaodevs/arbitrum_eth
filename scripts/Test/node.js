const { ethers, run } = require('hardhat')

async function main() {
  await run('compile')

  let provider = ethers.provider

  console.log('NetWorks ID is ', (await ethers.provider.getNetwork()).chainId)
  console.log('NetWorks Name is ', (await ethers.provider.getNetwork()).name)

  const [deployer] = await ethers.getSigners()

  console.log('deployer:' + deployer.address)

  let proxy_address = process.env.M_NODE;

  const node = await ethers.getContractAt('NodeStakingRewards', proxy_address, deployer)

  // let tx1 = await node.setRewardRate(208);
  // await tx1.wait();
  // console.log(tx1.hash);
  // return;
  let addrs = [
    // "0xe5df4f0BaDF3D8f573BEb147CA8BC8148335F9df",
    // "0xb8ea69055c3dadc309347E514Acd22eB9475c1E5",
    // "0xEBCAB1Fe0CBbA6f4E3c2eA7438939689FE58D77B",
    // "0x2AedD8B1268746Bc39b8a7F8416F4A77BF6dE379",
    // "0x2f504735DA0b120A926AB5D709e4Bb82f588B343",
    // "0x5d625650728fDdadf069183E92fB9c751CbAAc28",
    // "0x505Ee177444779F7a45eFE536Eb4dFa4FA7589bb",
    // "0x505Ee177444779F7a45eFE536Eb4dFa4FA7589bb",
    // "0x23db747Bf28a4a6BA72fA266ABb6c71CA1474F73",
    // "0x5b9BcA1268858C0e13A575D2a1f14973B8a19a2A",
    // "0x5b9BcA1268858C0e13A575D2a1f14973B8a19a2A",
    // "0x63bF15bcdfBE6B3bb715D6134C68Ce2583d23b7d",
    // "0xE534d7fa578F65352A3b47609890ff6F5a702894",
    // "0xd021e4B04f25f6D6a6E78985E74f4c52cC5798EF",
    // "0x3BdD948F1e1b93b2D5d8f4B307d6aA89982754B1",
    // "0x3BdD948F1e1b93b2D5d8f4B307d6aA89982754B1",
    // "0x1F7Bda8C3A86E4994147ef4004f1516EAE60Af4e",
    // "0xffe6F471907b8D29051539CEfC84a9df2861CCE7",
    // "0xCb31A9183450aD88B988Ab867747D37f4f49B5e7",
    // "0x30D67277E6dA5604e38FD5c81abeca4b73A76522",
    // "0x67D52AC6e2D359448146C7C257aB8d14FE101afb",
    // "0xe78DDB4C62bddFf60750547b77F0a1258DA1a55c",
    // "0xCb31A9183450aD88B988Ab867747D37f4f49B5e7",
    // "0x4391764EFb003C94692C7734ac284e584262a668",
    // "0x32f8E5F7d47fDd06B85b67f971C9b3828ddd969B",
    // "0x3e3A651bF559480327B1F702BA26B5a5fCE6aF4A",
    // "0x2889572Ae24FAd144bCAeA55Ebd4008D27EdE945",
    // "0x3D99D60c39F4cb832552238e26d582d6CfE1d62F",
    // "0x0eb54697C77ccE627bB00Bf1F085105E885D007B",
    // "0x0eb54697C77ccE627bB00Bf1F085105E885D007B",
    // "0x53b1585611C7fa17C43CDA1dfb87A4f036daC99f",
    // "0xF5f54AA99F517f4502Cc19c45e1478173eD1F956",
    // "0x3cd8fa5A3a629505a7DB7e19DC3E6B10667F09CD",
    // "0x16375a1E66CC37b75c8Bf3234E5f86aBf1099C0f",
    // "0x248b2fF2936b249513D29550220dCFBb99FDfad7",
    // "0x658247AA457f716B47cBb886E10E06E92210fb14",
    // "0x13a1cB7F6e596f6d99F1989d4dCfED063b91f41E",
    // "0xd3467580cd1fd90CAcc37534c4842f17EE8bB52f",
    // "0x97285C9DDA6035fE4E6cf637D1e2aaDaf384F97f",
    // "0x98fF6e185bFAD21C2DE62B607077059ff6955d35",
    // "0x817810187B7C00f11C89a76176aAf63CBdd1786C",
    // "0x26a0E8F65D996D40aC1eF2ed9D50573823630719",
    // "0x041cDA7630abD6BC26189D7e5a569537746AD8C9",
    // "0xD7FCa38A9793a8678294625880042AA449E6Cb2b",
    // "0x989993Dae715d727D1cFd478E845e958FD4Eb724",
    // "0xd73FC17f9d097142Beab57beE583Aa2b169eD77f",
    // "0xdeA365fc946b1AE627fb93F559C3dBDd625E8AB6",
    // "0xa0046B51Ed30097B3CCc1f3621C484bf60d2a230",
    // "0x36eb26A481CfFDe1187245AD1F7b56079D48a8D0",
    // "0x9FEc15a9e772a2A7BC4F178842d03904809562fd",
    // "0xD4795A5Aba5C38CdDCF0A1aBD48bD29f3FDd5DeC",
    // "0xB14df440D0B3f53AB2D070A02F3a12C9B8104E09",
    // "0x9B5FC8537c7Ecb21E608e2195B98406c0E883FD6",
    // "0x4DBBbf95b706B0446bB00486531d72A8D67D66f8",
    // "0xEEF666FA17661E1Cf7588082Ef9099c2a7b218cD",
    // "0x1d01B32242706F96bE83474B3284F9899B89a52E",
    // "0x059281fA7972e0120091c4F3a8ACe89F7F285b11",
    // "0x23ed439ca27e9562764FD5aa04b1D56d4F7d4F83",
    // "0xA78d8409C14701D05864919E677C4e31f31740cf",
    // "0x25838b4425E27844a336451791aCcC61Ee3278D4",
    // "0xFA508fE018d8827Ee4929E453f568f7fBA5fe4c1",
    // "0x7C3C89F4A4eA94701A4df6DDfBFbAa397E9a2cB8",
    // "0x836655427693FB3e01269731e9F5dB1a47729517",
    // "0x20c3a5b7839690728C2527ED72846a7463Fa2b9f",
    // "0xa7bc9daB3eb48b00568967f65fff4101fdcdbC64",
    // "0x5060862b7de393EEee5dA8f618771218755c3943",
    // "0x14F1Ee02CF09765915793e2C2D44A85ebAdcB70d",
    // "0x29e522025F97C4c1126deB823812fC9F2Fc4F8B4",
    // "0x5060862b7de393EEee5dA8f618771218755c3943",
    // "0xFB363468E9F63BD65B40F5085e10f6B5E0F1aC3b",
    // "0xc3C05cD85C0512c7fa54Ed012C0B523809B21318",
    // "0x5358BD88d0902A28B3435B8dBe8f68d4e619F5F2",
    // "0x03154DE5501F9140951B0408563f25BE2488667d",
    // "0xf7d8e55A55A3ae6BfAe4Bff8BAE29f093bd043Fb",
    // "0xD1dEEC6C9b97f221d1f834FE3AFE03C01fed7E75",
    // "0x9BB492356Dc65e0c6E226A9f7E83F06E4cf07479",
    // "0xE8CbC28d1c2661872751Af970e786A45Ac010b4d",
    // "0x5fB7C863699A9F568Fe6457F6CcbaA18dB0c8e71",
    "0xCB219013fF285E55C153fB5fC5775144d0b7F68F",
    "0x2B80DBC4728933c554e8dF564Ee6C4a7CB7Fb0D9",
    "0x19b3E442bf64D5453Dbe5580d930567c292d6174",
    "0x12C447611DCfDfeb5E4510d4ed5ee0dfCf7C9Ab6",
    "0x42e4A2CEC73ed0E40270FB04155Ce38B70541ec6",
    "0xe0f98e9E1F95D687f102B9B5511E8EC2700eacdD",
    "0xf6AEf50B86dC8660e9280862AcC61634aAc1891D",
    "0x13D0b47fA4415bD902c9075aec84E992fe6ce06f",
    "0xBc285C0b29B8E40E1017493d0a84887fa2BD3BDF",
    "0x151322735E59fD08fF31E64e5302467c46FE8fE1",
    "0x91daAb05fA31FfC3813Af8d334A0e3f5eb52B526",
    "0x0a2D478a929b17715161c5E6BaeF99a62589aF65",
    "0xCE91c2Cb3fcBC372c79280e0b42057Ce2488cafD",
    "0x9E3ca9511aB8974cB64Aef123cA01F20E088a8D4",
    "0x7560101be5bc4dB4E883040D680FdDf3DA7C39A2",
    "0xa1263871dEaEF2CB529d0e119dDb9E2228427A45",
    "0x2df50328b7722F6e5C1d9c266eAd3a3cd2bc5438",
    "0xFD4366903ecDaFa0A37a195E6b51515B95340754",
    "0x30C5B3C3893C0bEff50E777CD29d123F6d597273",
    "0x151322735E59fD08fF31E64e5302467c46FE8fE1",
    "0x30C5B3C3893C0bEff50E777CD29d123F6d597273",
    "0x078179dc778A704617D5AADF288Ce510d7d60B2C",
  ]

  let tx = await node.batchStandardStake(addrs);
  await tx.wait();
  console.log(tx.hash);
  return;

  let rewardRate = await node.rewardRate();
  console.log(rewardRate);
  // return;
  let getRewardsTx = await node.batchDelegateGetReward([
    "0x20c3a5b7839690728C2527ED72846a7463Fa2b9f",
    "0xFB363468E9F63BD65B40F5085e10f6B5E0F1aC3b"]
  );
  await getRewardsTx.wait();
  console.log(getRewardsTx.hash);
  return;

  // let time = await node.lastTimeRewardApplicable();
  // console.log(time);
  let owner = await node.earned("0xFA508fE018d8827Ee4929E453f568f7fBA5fe4c1");
  console.log(ethers.utils.formatEther(owner));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
