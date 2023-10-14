//SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.6;

import "../owner/Manage.sol";
import "./IBridgeToken.sol";
import "./QueueSet.sol";
import "../TransferHelper.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


/// bridge from
contract BTCCBridge is Manage {

    using QueueSet for QueueSet.Set;
    using TransferHelper for address;
    using SafeMath for uint256;

    mapping(address => QueueSet.Set) set;
    address public wallet;
    address feeTo;
    mapping(address => bool) public bridgeable;
    mapping(address => uint256) public nonces;
    /// usdt decimal
    uint256 public minimumAmount = 10E6;

    uint256 constant public denominator = 1000; 
    uint256 public feeRate = 30;
    uint256 public gasFee = 5E6;
    uint256 public totalFeeAmount;

    error QueueDataNotMatch(string to, uint256 nonce);

    event TokenBridge(
        address indexed from, 
        address indexed token, 
        string to, 
        uint256 amount, 
        uint256 fee, 
        uint256 nonce,
        uint256 blockTime
    );

    event BridgeConfirm(
        address indexed from, 
        address indexed token, 
        string to, 
        uint256 amount, 
        uint256 nonce,
        uint256 blockTime
    );

    event TokenSend(
        address indexed token, 
        address indexed to, 
        uint256 amount, 
        string hash, 
        uint256 blocktime
    );

    constructor(address _usdt){
        wallet = msg.sender;
        feeTo = msg.sender;
        bridgeable[_usdt] = true;
    }

    modifier onlyValidToken(address token) {
        require(bridgeable[token], "E: token is invalid");
        _; 
    }

    function bridgeToken(address token, uint256 amount, string calldata to) external onlyValidToken(token) {
        require(amount >= minimumAmount, "E: amount must exceed minimum amount");

        uint256 fee = amount.mul(feeRate).div(denominator);
        fee += gasFee;
      
        totalFeeAmount += fee;

        token.safeTransferFrom(msg.sender, address(this), amount);
       // token.burn(amount);
       (bool success, ) = token.call(abi.encodeWithSignature("burn(uint256)", amount));
       require(success, "E: burn error");

        QueueSet.Queue memory queue = QueueSet.Queue(
            msg.sender, 
            nonces[msg.sender] ++,
            token,
            to,
            amount,
            fee,
            block.timestamp
        );

        set[msg.sender].add(queue);

        emit TokenBridge(msg.sender, token, to, amount, fee, nonces[msg.sender], block.timestamp);
    }

    function getQueneLength(address user) external view returns (uint256) {
        QueueSet.Set storage toSet = set[user];

        return toSet.length();
    }

    function getQueneByIndex(address user, uint256 index) external view returns (QueueSet.Queue memory) {
        QueueSet.Set storage toSet = set[user];

        return toSet.at(index);
    }

    function getQueneList(address user) external view returns (QueueSet.Queue[] memory) {
        QueueSet.Set storage toSet = set[user];

        return toSet.values();
        
    }

    function harvestFee(address token, address to) external onlyOwner {
        token.safeTransfer(to, totalFeeAmount);
        totalFeeAmount = 0;
    }

    function addToken(address token) external onlyManage {
        bridgeable[token] = true;
    }

    function removeToken(address token) external onlyManage {
        bridgeable[token] = false;
    }

    function setGasFee(uint256 gasFeeAmount) external onlyManage {
        gasFee = gasFeeAmount;
    }
    
    function transferWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "E: wallet cant be zero");
        wallet = _wallet;
    }
    
    function transferFeeTo(address _feeto) external onlyOwner {
        require(_feeto != address(0), "E: feeTo cant be zero");
        feeTo = _feeto;
    }
}









