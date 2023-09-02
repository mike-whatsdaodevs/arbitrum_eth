// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

interface IMigrate {

    struct StakeInfo {
        uint256 consumption;
        uint256 earned;
    }

    event SetZfuel(address manage, address token);

    event SetBTCZ(address manage, address token);

    event Claim(address indexed token, address caller, uint256 amountCalim, uint256 amountBurn, uint256 timestamp);

    event HARVEST(address caller, uint256 consumption, uint256 earned, uint256 timestamp);

    event TacKBack(address recipient, uint256 amount, uint256 blocktime);

    /**
     * @dev claim new btcz according snapshot;
     * 
     * Notice
     */ 
    function claimBTCZ() external;
    function claimZWatt() external;

    // harvert stake btcz according snapshot
    // neet new zwatt approve this contract
    function harvest() external ;

    function setZfuel(address _token) external;

    function setBTCZ(address _token) external;

    function setWallet(address _wallet) external;

    function takeBackToken(address token, address recipient) external;

    // harvest consumption 
    function consumption(address addr) external view returns(uint256 amount);

    // harvest earned
    function earned(address addr) external view returns(uint256 amount);

    // set stake info
    function setStakeInfo(address _staker, uint256 _consumption, uint256 _earned) external;

    // batch set stake info
    function batchSetStakeInfo(
        address[] calldata _stakers, 
        uint256[] calldata _consumptions, 
        uint256[] calldata _earneds
    ) external;

}















