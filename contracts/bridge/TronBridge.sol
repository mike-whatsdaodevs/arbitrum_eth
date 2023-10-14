//SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.6;

import "../owner/Manage.sol";
import "./IBridgeToken.sol";
// import "../TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/// bridge from
contract TronBridge is Manage {
    // using TransferHelper for address;
    address feeTo;
    mapping(address => bool) public bridgeable;

    event TokenSend(
        address indexed token, 
        address indexed to, 
        uint256 amount, 
        uint256 blocktime
    );

    constructor(address _usdt){
        feeTo = msg.sender;
        bridgeable[_usdt] = true;
    }

    modifier onlyValidToken(address token) {
        require(bridgeable[token], "E: token is invalid");
        _; 
    }

    function tokenSend(address token, address to, uint256 amount, uint256 fee) external onlyManage {
        IERC20(token).transfer(to, amount);
        IERC20(token).transfer(feeTo, fee);

        emit TokenSend(token, to, amount, block.timestamp);
    }

    function tokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function addToken(address token) external onlyManage {
        bridgeable[token] = true;
    }

    function removeToken(address token) external onlyManage {
        bridgeable[token] = false;
    }

    function transferFeeTo(address _feeto) external onlyOwner {
        require(_feeto != address(0), "E: feeTo cant be zero");
        feeTo = _feeto;
    }

    function tackTokenBack(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}









