// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Test {
    using SafeMath for uint256;
    uint256 public consumptionRate = 0;
    uint256 public periodFinish = 0;
    uint256 public lastUpdateTime;
    mapping(address => uint256) public consumptions;
    mapping(address => uint256) public _consumptionOf;

    constructor(uint256 _rewardsDuration) {
        consumptionRate = uint256(1e18).div(3600);
        periodFinish = block.timestamp.add(_rewardsDuration);
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function setRate(uint256 _num) public updateReward(msg.sender) {
        _consumptionOf[msg.sender] += _num;
    }

    function setCons(uint256 _num) public updateReward(msg.sender) {}

    function consumption(address _owner) public view returns (uint256) {
        return
            _consumptionOf[_owner]
                .mul(consumptionRate)
                .mul(lastTimeRewardApplicable().sub(lastUpdateTime))
                .add(consumptions[_owner]);
    }

    function getConsumptions(address _owner) external view returns (uint256) {
        return consumptions[_owner];
    }

    modifier updateReward(address owner) {
        consumptions[owner] = consumption(owner);
        lastUpdateTime = lastTimeRewardApplicable();
        _;
    }
}
