// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {OwnableUpgradeable as Ownable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract ValidatorStakingRewards is Ownable, UUPSUpgradeable, PausableUpgradeable {
    // Minimum of last updated time and reward finish time
    uint public updatedAt;
    // Reward to be paid out per second
    uint public rewardRate;
    // Sum of (reward rate * dt * 1e18 / total supply)
    uint public rewardPerTokenStored;
    // User address => rewardPerTokenStored
    mapping(address => uint) public userRewardPerTokenPaid;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;
    // Total staked
    uint public totalSupply;
    // User address => staked amount
    mapping(address => uint) public balanceOf;

    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    receive() external payable {
        stake();
    }

    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        updatedAt = lastTimeRewardApplicable();

        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }

        _;
    }

    function lastTimeRewardApplicable() public view returns (uint) {
        return block.timestamp;
    }

    function rewardPerToken() public view returns (uint) {
        return
            rewardPerTokenStored +
            (rewardRate * (lastTimeRewardApplicable() - updatedAt) * 1e18) / 10_000_000_000;
    }

    function setRewardRate(uint rate) external onlyOwner {
        rewardRate = rate;
    }

    function stake() public payable updateReward(msg.sender) {
        uint _amount = msg.value;
        require(_amount >= 1000 ether, "amount = 0");
        // stakingToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;
    }

    function deletegateStake(address to) public payable updateReward(to) {
        uint _amount = msg.value;
        require(_amount >= 1000 ether, "amount = 0");
        balanceOf[to] += _amount;
        totalSupply += _amount;
    }


    function standardStake(address to) public payable updateReward(to) {
        uint _amount = 1000 ether;
        balanceOf[to] += _amount;
        totalSupply += _amount;
    }


    function withdraw() external whenNotPaused updateReward(msg.sender) {
        uint _amount = balanceOf[msg.sender];
        require(_amount > 0, "amount = 0");
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function earned(address _account) public view returns (uint) {
        return
            (
                (balanceOf[_account] *
                    (rewardPerToken() - userRewardPerTokenPaid[_account])
                ) / 1e18
            ) +
            rewards[_account];
    }

    function getReward() external updateReward(msg.sender) {
        uint reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            payable(msg.sender).transfer(reward);
        }
    }

    function deletegateGetReward(address to) public updateReward(to) {
        uint reward = rewards[to];
        if (reward > 0) {
            rewards[to] = 0;
            payable(to).transfer(reward);
        }
    }

    function batchDelegateGetReward(address[] calldata addrs) external {
        uint len = addrs.length;

        for(uint i; i < len; ++i ) {
            deletegateGetReward(addrs[i]);
        }
    }

    function takeBack() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

    function _min(uint x, uint y) private pure returns (uint) {
        return x <= y ? x : y;
    }

    /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }
}

