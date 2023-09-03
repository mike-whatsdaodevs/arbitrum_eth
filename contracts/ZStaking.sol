// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import {ERC721HolderUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import {EnumerableMapUpgradeable as EnumerableMap} from "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableMapUpgradeable.sol";
import {EnumerableSetUpgradeable as EnumerableSet} from "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import {SafeMathUpgradeable as SafeMath} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {IERC20Upgradeable as IERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {IERC721Upgradeable as IERC721} from "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import {MathUpgradeable as Math} from "@openzeppelin/contracts-upgradeable/utils/math/MathUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {INFTProperty} from "./interface/INFTProperty.sol";
import {IZfuel} from "./interface/IZfuel.sol";

contract ZStaking is 
    ReentrancyGuardUpgradeable, 
    OwnableUpgradeable, 
    PausableUpgradeable, 
    ERC721HolderUpgradeable, 
    UUPSUpgradeable 
{
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    EnumerableMap.UintToAddressMap private _minerOwners;

    struct NftStake {
        address staker;
        address nftAddr;
        uint256 minerId;
        uint256 hashRate;
        uint256 consumption;
        uint256 lastUpdateTime;
    }

    mapping(address => bool) public minerList;
    INFTProperty public property;

    /* ========== STATE VARIABLES ========== */
    // addreses
    IERC20 public BTCZ;
    IZfuel public zFuel;
    IERC721 public NFTMiner;

    uint256 private _totalHashRate;
    uint256 private _totalConsumption;

    address public fuelReceiver;
    uint256 public lastUpdateTime;
    uint256 public zFuelRate;
    uint256 public rewardRate;
    uint256 public consumptionRate;
    uint256 public periodFinish;
    uint256 public deductionCount;
    uint256 public rewardsDuration;
    uint256 public rewardPerHashRateStored;
    uint256 public consumptionPerHashRateStored;
    uint256 public BASE_DIVIDER;
    uint256 public FIRST_EPOCH_REWARDS;

    // User's reward amount
    mapping(address => uint256) public rewards;
    mapping(uint256 => NftStake) public nftStakes;
    mapping(address => uint256) public consumptions;
    // user's computing power
    mapping(address => uint256) private _hashRateOf;
    // User consumption
    mapping(address => uint256) private _consumptionOf;
    // User consumption all
    mapping(address => uint256) private _consumptionAllOf;
    mapping(address => uint256) public userRewardPerHashRatePaid;
    mapping(address => uint256) public userConsumptionPerHashRatePaid;
    mapping(address => EnumerableSet.UintSet) private _holderMiners;

    /* ========== CONSTRUCTOR ========== */

    constructor() {
        _disableInitializers();
    }

    modifier onlyValidMiner(address miner) {
        require(minerList[miner] == true, "E: miner is not valid");
        _;
    }

    function initialize(
        address _mBtcToken,
        address _mFuelToken,
        address _property,
        uint256 _rewardsDuration
    ) external initializer {
        __ERC721Holder_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();

        require(_rewardsDuration != 0, "rewardsDuration is zero");
        BTCZ = IERC20(_mBtcToken);
        zFuel = IZfuel(_mFuelToken);
        property = INFTProperty(_property);
        rewardsDuration = _rewardsDuration;

        zFuelRate = 50;
        BASE_DIVIDER = 100;
        FIRST_EPOCH_REWARDS = 50 * 6 * 24 * 365 * 4 ether;

    }

    // Open mining pool
    function start() external onlyOwner {
        BTCZ.transferFrom(msg.sender, address(this), BTCZ.totalSupply());
        notifyRewardAmount(FIRST_EPOCH_REWARDS);
        emit Start(msg.sender);
    }

    // Initialize basic data
    function notifyRewardAmount(uint256 reward)
        private
        updateReward(address(0))
    {
        consumptionRate = uint256(1e18).div(3600);
        if (block.timestamp >= periodFinish) {
            rewardRate = reward.div(rewardsDuration);
        } else {
            uint256 remaining = periodFinish.sub(block.timestamp);
            uint256 leftover = remaining.mul(rewardRate);
            rewardRate = reward.add(leftover).div(rewardsDuration);
        }

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp.add(rewardsDuration);
        emit RewardAdded(reward);
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    // Reward per unit of token
    function rewardPerToken() public view returns (uint256) {
        if (_totalHashRate == 0) {
            return rewardPerHashRateStored;
        }

        return
            rewardPerHashRateStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(_totalHashRate)
            );
    }

    function consumptionPerToken() public view returns (uint256) {
        if (_totalHashRate == 0) {
            return consumptionPerHashRateStored;
        }

        return
            consumptionPerHashRateStored.add(
                lastTimeRewardApplicable().sub(lastUpdateTime).mul(
                    consumptionRate
                )
            );
    }

    // Calculate earnings
    function earned(address _owner) public view returns (uint256) {
        return
            _hashRateOf[_owner]
                .mul(rewardPerToken().sub(userRewardPerHashRatePaid[_owner]))
                .div(1e18)
                .add(rewards[_owner]);
    }

    // Calculate consumption
    function consumption(address _owner) public view returns (uint256) {
        return
            _consumptionOf[_owner]
                .mul(
                    consumptionPerToken().sub(
                        userConsumptionPerHashRatePaid[_owner]
                    )
                )
                .add(consumptions[_owner]);
    }

    /**
     *    @notice nft deposit contract
     *    @param minerIds => array of nft ids
     */
    function batchStake(address[] calldata nftAddrs, uint256[] calldata minerIds) external {
        for (uint256 i = 0; i < minerIds.length; i++) {
            stake(nftAddrs[i], minerIds[i]);
        }
    }

    /**
     *    @notice nft deposit contract
     *    @param minerId => nft id
     */
    function stake(address nftAddr, uint256 minerId)
        public
        whenNotPaused
        onlyValidMiner(nftAddr)
        updateReward(msg.sender)
        nonReentrant
    {
        uint256 hashRate = property.getHashRate(nftAddr, minerId);
        require(hashRate != 0, "Staking: Id not exist");
        uint256 _consumption = property.getConsumption(nftAddr, minerId);
        require(_consumption != 0, "Staking: Id not exist");

        IERC721(nftAddr).safeTransferFrom(msg.sender, address(this), minerId);

        nftStakes[minerId] = NftStake({
            staker: msg.sender,
            nftAddr: nftAddr,
            minerId: minerId,
            hashRate: hashRate,
            consumption: _consumption,
            lastUpdateTime: block.timestamp
        });
        _holderMiners[msg.sender].add(minerId);
        _minerOwners.set(minerId, msg.sender);
        _totalHashRate = _totalHashRate.add(hashRate);
        _hashRateOf[msg.sender] = _hashRateOf[msg.sender].add(hashRate);
        _consumptionOf[msg.sender] = _consumptionOf[msg.sender].add(
            _consumption
        );
        emit MinerStaked(msg.sender, minerId);
    }

    /**
     *   @notice withdraw nft from contract
     */
    function batchWithdrawMiners(address[] calldata nftAddrs, uint256[] calldata minerIds) external {
        for (uint256 i = 0; i < minerIds.length; i++) {
            withdrawMiner(nftAddrs[i], minerIds[i]);
        }
    }

    /**
     *   @notice withdraw nft from contract
     */
    function withdrawAllMiners(address nftAddr) external {
        uint256 amount = minerAmountOf(msg.sender);
        for (uint256 i = 0; i < amount; i++) {
            withdrawMiner(nftAddr, minerOfOwnerByIndex(msg.sender, 0));
        }
    }

    /**
     *   @notice withdraw nft from contract
     */
    function withdrawMiner(address nftAddr, uint256 minerId)
        public
        updateReward(msg.sender)
        onlyValidMiner(nftAddr)
        checkDeduction
        nonReentrant
    {
        require(
            minerOwnerOf(minerId) == msg.sender,
            "withdraw of token that is not own"
        );
        NftStake memory nftStake = nftStakes[minerId];
        _totalHashRate = _totalHashRate.sub(nftStake.hashRate);
        _hashRateOf[msg.sender] = _hashRateOf[msg.sender].sub(
            nftStake.hashRate
        );

        _consumptionOf[msg.sender] = _consumptionOf[msg.sender].sub(
            nftStake.consumption
        );
        _holderMiners[msg.sender].remove(minerId);
        _minerOwners.set(minerId, address(0));

        delete nftStakes[minerId];

        IERC721(nftAddr).safeTransferFrom(address(this), msg.sender, minerId);
        emit MinerWithdrawn(msg.sender, minerId);
    }

    // Receive award
    function getReward()
        public
        nonReentrant
        updateReward(msg.sender)
        checkDeduction
    {
        uint256 reward = rewards[msg.sender];
        uint256 currentConsumption = consumptions[msg.sender];
        uint256 zFuelAmount = zFuel.balanceOf(msg.sender);
        require(
            zFuelAmount >= currentConsumption,
            "ZWatt Insufficient balance"
        );
        _consumptionAllOf[msg.sender] = _consumptionAllOf[msg.sender].add(
            currentConsumption
        );
        _totalConsumption = _totalConsumption.add(currentConsumption);
        if (reward > 0) {
            uint256 burnAmount = currentConsumption.mul(zFuelRate).div(
                BASE_DIVIDER
            );
            zFuel.transferFrom(
                msg.sender,
                fuelReceiver,
                currentConsumption.sub(burnAmount)
            );
            //mFuel burn
            zFuel.transferFrom(msg.sender, address(this), burnAmount);
            zFuel.burn(burnAmount);

            rewards[msg.sender] = 0;
            consumptions[msg.sender] = 0;
            BTCZ.transfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    // total hashrate
    function totalHashRate() external view returns (uint256) {
        return _totalHashRate;
    }

    // owner hashrate
    function hashRateOf(address _owner) external view returns (uint256) {
        return _hashRateOf[_owner];
    }

    // total consumption
    function totalConsumption() external view returns (uint256) {
        return _totalConsumption;
    }

    // owner consumption
    function consumptionOf(address _owner) external view returns (uint256) {
        return _consumptionOf[_owner];
    }

    // owner consumption all
    function consumptionAllOf(address _owner) external view returns (uint256) {
        return _consumptionAllOf[_owner];
    }

    function minerOwnerOf(uint256 tokenId) private view returns (address) {
        return _minerOwners.get(tokenId, "query for nonexistent token");
    }

    function minerAmountOf(address owner) public view returns (uint256) {
        require(
            owner != address(0),
            "Staking: balance query for the zero address"
        );
        return _holderMiners[owner].length();
    }

    function minerOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        return _holderMiners[owner].at(index);
    }

    function setZFuelAddress(address _addr) external onlyOwner whenNotPaused {
        require(_addr != address(0), "address is zero");
        zFuel = IZfuel(_addr);
    }

    function setNFTStatus(address _addr, bool status) external onlyOwner whenNotPaused {
        require(_addr != address(0), "address is zero");
        minerList[_addr] = status;
    }

    function setProperty(address _addr) external onlyOwner whenNotPaused {
        require(_addr != address(0), "address is zero");
        property = INFTProperty(_addr);
    }

    function setZfuelRate(uint256 rate) external onlyOwner whenNotPaused {
        require(rate > 0, "rate is zero");
        zFuelRate = rate;
        emit SetZfuelRate(rate, msg.sender);
    }

    function setFuelReceiver(address _address)
        external
        onlyOwner
        whenNotPaused
    {
        require(_address != address(0), "address is zero");
        fuelReceiver = _address;
        emit SetFuelReceiver(_address, msg.sender);
    }

    function setRewardsDuration(uint256 _rewardsDuration) external onlyOwner {
        require(
            block.timestamp > periodFinish,
            "Previous rewards period must be complete before changing the duration for the new period"
        );
        rewardsDuration = _rewardsDuration;
        emit RewardsDurationUpdated(rewardsDuration);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    function pause() public virtual onlyOwner {
        _pause();
        emit SetPause(msg.sender);
    }

    function unpause() public virtual onlyOwner {
        _unpause();
        emit SetUnPause(msg.sender);
    }

    // Added to support recovering LP Rewards from other systems such as BAL to be distributed to holders
    function recoverERC20(address tokenAddress, uint256 tokenAmount)
        external
        onlyOwner
    {
        // Cannot recover the staking token or the rewards token
        require(
            tokenAddress != address(BTCZ),
            "Cannot withdraw the staking or rewards tokens"
        );
        IERC20(tokenAddress).transfer(owner(), tokenAmount);
        emit Recovered(tokenAddress, tokenAmount);
    }

    /* ========== MODIFIERS ========== */

    modifier updateReward(address owner) {
        rewardPerHashRateStored = rewardPerToken();
        consumptionPerHashRateStored = consumptionPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (owner != address(0)) {
            rewards[owner] = earned(owner);
            consumptions[owner] = consumption(owner);
            userRewardPerHashRatePaid[owner] = rewardPerHashRateStored;
            userConsumptionPerHashRatePaid[
                owner
            ] = consumptionPerHashRateStored;
        }
        _;
    }

    // todo periodFinish > 0
    modifier checkDeduction() {
        if (periodFinish != 0) {
            if (block.timestamp > periodFinish) {
                deductionCount = deductionCount.add(1);
                uint256 nextEpochRewards = FIRST_EPOCH_REWARDS;
                for (uint256 i = 1; i <= deductionCount; i++) {
                    nextEpochRewards = nextEpochRewards.div(2);
                }
                notifyRewardAmount(nextEpochRewards);
            }
        }
        _;
    }

    /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }


    /* ========== EVENTS ========== */

    event Start(address user);
    event SetPause(address _owner);
    event SetUnPause(address _owner);
    event RewardAdded(uint256 reward);
    event MinerStaked(address indexed user, uint256 id);
    event MinerWithdrawn(address indexed user, uint256 id);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardsDurationUpdated(uint256 newDuration);
    event Recovered(address token, uint256 amount);
    event SetZfuelRate(uint256 rate, address user);
    event SetFuelReceiver(address recevier, address user);
}
