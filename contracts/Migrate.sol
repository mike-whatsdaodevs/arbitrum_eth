// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {SafeMathUpgradeable as SafeMath} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IMigrate} from "./interface/IMigrate.sol";


contract Migrate is IMigrate, OwnableUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    using SafeMath for uint256;

    IERC20 btcz;
    IERC20 formerBtcz;
    IERC20 zfuel;
    IERC20 formerZfuel;

    mapping(address => StakeInfo) public harvestYield;
    mapping(address => uint256) public btczEligibles;
    mapping(address => uint256) public zwattEligibles;

    address wallet;

    uint256 public totalBTCZHolderAddress;
    uint256 public totalBTCZAmount;

    uint256 public totalZWattHolderAddress;
    uint256 public totalZWattAmount;


    uint256 public totalStakeAddress;
    uint256 public totalConsumption;
    uint256 public totalEarned;

    constructor() {
        _disableInitializers();
    }


    function initialize(
        address _btcz, 
        address _zfuel, 
        address _formerBtcz, 
        address _formerZfuel,
        address _wallet
    ) external initializer {

        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();

        btcz = IERC20(_btcz);
        zfuel = IERC20(_zfuel);
        formerBtcz = IERC20(_formerBtcz);
        formerZfuel = IERC20(_formerZfuel);

        wallet = _wallet;
    }

    receive() payable external {
        require(false);
    }

    /**
     * @dev claim new btcz according snapshot;
     * 
     * Notice
     */ 
    function claimBTCZ() external override virtual whenNotPaused {
        address caller = msg.sender;
        uint256 btczEligibleAmount = btczEligibles[caller];
        require(btczEligibleAmount > 0, "E: btcz eligible amount cant be zero");

        // burn hold btcz what they have
        // dont need equal to snapshot info
        uint256 formerBalance = formerBtcz.balanceOf(caller);
        formerBtcz.transferFrom(caller, wallet, formerBalance);

        // send new btcz to caller according snapshot
        btcz.transfer(caller, btczEligibleAmount);

        totalBTCZHolderAddress = totalBTCZHolderAddress.sub(1);
        delete btczEligibles[caller];

        totalBTCZAmount = totalBTCZAmount.sub(btczEligibleAmount);

        emit Claim(address(btcz), caller, btczEligibleAmount, formerBalance, block.timestamp);
    }

     /**
     * @dev swap erc20 token with zfuel
     * 
     * uint256 _amount: zfuel amount, 
     * 
     * Notice
     * - need add decimal 0
     */ 
    function claimZWatt() external override virtual whenNotPaused {
        address caller = msg.sender;
        uint256 zwattEligibleAmount = zwattEligibles[caller];
        require(zwattEligibleAmount > 0, "E: zwatt eligible amount cant be zero");

        uint256 formerBalance = formerZfuel.balanceOf(caller);
        formerZfuel.transferFrom(caller, wallet, formerBalance);
        
        zfuel.transfer(caller, zwattEligibleAmount);
       
        totalZWattHolderAddress = totalZWattHolderAddress.sub(1);
        delete zwattEligibles[caller];
        
        totalZWattAmount = totalZWattAmount.sub(zwattEligibleAmount);
        
        emit Claim(address(zfuel), caller, zwattEligibleAmount, formerBalance, block.timestamp);

    }

    // harvert stake btcz according snapshot
    // neet new zwatt approve this contract
    function harvest() external override virtual whenNotPaused {
        address caller = msg.sender;
        StakeInfo memory stakeInfo = harvestYield[caller];

        uint256 zfuelBalance = zfuel.balanceOf(caller);
        require(zfuelBalance >= stakeInfo.consumption, "E: zwatt balance is not enough to harvert");

        require(stakeInfo.consumption > 0 || stakeInfo.earned > 0, "E: there is not btcz to harvest");

        zfuel.transferFrom(caller, wallet, stakeInfo.consumption);
        btcz.transfer(caller, stakeInfo.earned);


        totalStakeAddress = totalStakeAddress.sub(1);
        totalConsumption = totalConsumption.sub(stakeInfo.consumption);
        totalEarned = totalEarned.sub(stakeInfo.earned);

        delete harvestYield[caller];

        emit HARVEST(caller, stakeInfo.consumption, stakeInfo.earned, block.timestamp);
    }

    function setZfuel(address _token) external override virtual onlyOwner {
        require(_token != address(0), "token is zero");
        zfuel = IERC20(_token);
    }

    function setBTCZ(address _token) external override virtual onlyOwner {
        require(_token != address(0), "token is zero");
        btcz = IERC20(_token);
    }

    function setWallet(address _wallet) external override virtual onlyOwner {
        require(_wallet != address(0), "address is not 0");
        wallet = _wallet;
    }

    
    function leftBalance(address token) public view returns(uint) {
        return IERC20(token).balanceOf(address(this));
    }

    function takeBackToken(address token, address recipient) external override virtual onlyOwner {
        uint256 amount = leftBalance(token);
        IERC20(token).transfer(recipient, amount);

        emit TacKBack(recipient, amount, block.timestamp);
    }

    // harvest consumption 
    function consumption(address addr) public view override virtual returns(uint256 amount) {
        StakeInfo memory stakeInfo = harvestYield[addr];
        
        amount = stakeInfo.consumption;        
    }

    // harvest earned
    function earned(address addr) public view override virtual returns(uint256 amount) {
        StakeInfo memory stakeInfo = harvestYield[addr];
        
        amount = stakeInfo.earned; 
    }

    // set btcz snapshot
    function setBTCZEligibleAmount(address _holder, uint256 _btczEligibleAmount) public onlyOwner {
        require(_holder != address(0), "E: holder cant be zero");
        require(_btczEligibleAmount != 0, "cant both be zero");

        uint256 beforeAmount = btczEligibles[_holder];

        if(beforeAmount > 0) {
            totalBTCZHolderAddress = totalBTCZHolderAddress.sub(1);
            totalBTCZAmount = totalBTCZAmount.sub(beforeAmount);
        }

        btczEligibles[_holder] = _btczEligibleAmount;

        totalBTCZHolderAddress = totalBTCZHolderAddress.add(1);
        totalBTCZAmount = totalBTCZAmount.add(_btczEligibleAmount);
    }

    function batchSetBTCZEligibleAmount(address[] calldata _holders, uint256[] calldata _amounts) external onlyOwner {
        uint256 len = _holders.length;

        for(uint256 i = 0; i < len; i ++) {
            setBTCZEligibleAmount(_holders[i], _amounts[i]);
        }
    } 

    // set btcz snapshot
    function setZWattEligibleAmount(address _holder, uint256 _zwattEligible) public onlyOwner {
        require(_holder != address(0), "E: holder cant be zero");
        require(_zwattEligible != 0, "E: zwatt eligibel amount cant be zero");

        uint256 beforeAmount = zwattEligibles[_holder];

        if(beforeAmount > 0) {
            totalZWattHolderAddress = totalZWattHolderAddress.sub(1);
            totalZWattAmount = totalZWattAmount.sub(beforeAmount);
        }

        zwattEligibles[_holder] = _zwattEligible;

        totalZWattHolderAddress = totalZWattHolderAddress.add(1);
        totalZWattAmount = totalZWattAmount.add(_zwattEligible);
    }

    function batchSetZWattEligibleAmount(address[] calldata _holders, uint256[] calldata _amounts) external onlyOwner {
        uint256 len = _holders.length;

        for(uint256 i = 0; i < len; i ++) {
            setZWattEligibleAmount(_holders[i], _amounts[i]);
        }
    } 

    function getEligibelAmount(address _holder) external view returns(uint256 btczEligibel, uint256 zwattEligible) {
        btczEligibel = btczEligibles[_holder];
        zwattEligible = zwattEligibles[_holder];
    }

    // set stake info
    function setStakeInfo(address _staker, uint256 _consumption, uint256 _earned) public override virtual onlyOwner {
        require(_staker != address(0), "E: staker cant be zero");
        require(_consumption != 0 && _earned != 0, "consumption and earned cant be zero");

        StakeInfo memory stakeInfo = harvestYield[_staker];

        stakeInfo.consumption = stakeInfo.consumption.add(_consumption);
        stakeInfo.earned = stakeInfo.earned.add(_earned);

        totalStakeAddress = totalStakeAddress.add(1);
        totalConsumption = totalConsumption.add(_consumption);
        totalEarned = totalEarned.add(_earned);

        harvestYield[_staker] = stakeInfo;
    }

    function removeStakeOfOwner(address _staker) external onlyOwner {
        require(_staker != address(0), "E: staker cant be zero");

        StakeInfo memory stakeInfo = harvestYield[_staker];

        delete harvestYield[_staker];
        
        if(stakeInfo.consumption > 0 || stakeInfo.earned > 0) {
            totalStakeAddress = totalStakeAddress.sub(1);

            if(stakeInfo.consumption > 0) {
                totalConsumption = totalConsumption.sub(stakeInfo.consumption);
            }
            if(stakeInfo.earned > 0) {
                totalEarned = totalEarned.sub(stakeInfo.earned);
            }
        }
    }

    // batch set stake info
    function batchSetStakeInfo(
        address[] calldata _stakers, 
        uint256[] calldata _consumptions, 
        uint256[] calldata _earneds
        ) 
        external 
        override 
        virtual 
        onlyOwner 
    {
        uint256 len = _stakers.length;

        for(uint256 i = 0; i < len; i ++) {
            setStakeInfo(_stakers[i], _consumptions[i], _earneds[i]);
        }
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

    /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }


}















