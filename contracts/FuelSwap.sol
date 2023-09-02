// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./owner/Manage.sol";

contract FuelSwap is ReentrancyGuard, Manage {
    using SafeMath for uint256;

    IERC20 payToken;
    IERC20 mfuel;

    address payable wallet;


    // how much erc20 to 1 mfuel
    uint256 public price = 1E20;

    uint256 constant _1Mfuel = 1E18;

     // how much ETH to 1 mfuel
    uint256 public ethprice;

    constructor(address _pay, address _mfuel, address _wallet) {
        payToken = IERC20(_pay);
        mfuel = IERC20(_mfuel);
        wallet = payable(_wallet);
    }

    event SetMfuel(address manage, address token);
    event SetPayToken(address manage, address token);
    event SetPrice(address manage, uint256 _price);
    event Swap(address buyer, uint256 _price, uint256 payAmount, uint256 mfuelAmount);
    event TacKBack(address recipient, uint256 amount, uint256 blocktime);

    receive() payable external {
        swapForETH();
    }

    /**
     * @dev swap erc20 token with mfuel
     * 
     * uint256 _amount: mfuel amount, 
     * 
     * Notice
     * - need add decimal 0
     */ 
    function swap(uint256 payamount) external nonReentrant {
        payamount = payamount.mul(1E18);
        uint256 mfuelAmount = payamount.mul(price).div(_1Mfuel);
        payToken.transferFrom(msg.sender, wallet, payamount);
        mfuel.transfer(msg.sender, mfuelAmount);
        emit Swap(msg.sender, price, payamount, mfuelAmount);
    }

    // @dev receive eth to swap Mfuel
    function swapForETH() public payable nonReentrant {
        uint256 payamount = msg.value;
        uint256 mfuelAmount = payamount.mul(ethprice).div(_1Mfuel);
        mfuel.transfer(msg.sender, mfuelAmount);
        wallet.transfer(payamount);
        emit Swap(msg.sender, ethprice, payamount, mfuelAmount);
    }

    function setMfuel(address _token) external onlyManage {
        require(_token != address(0), "token is zero");
        mfuel = IERC20(_token);
        emit SetMfuel(msg.sender, _token);
    }

    function changeWallet(address _newWallet) external onlyManage {
        require(_newWallet != address(0), "new wallet is zero");
        wallet = payable(_newWallet);
    }

    function setPayToken(address _token) external onlyManage {
        require(_token != address(0), "token is zero");
        payToken = IERC20(_token);
        emit SetPayToken(msg.sender, _token);
    }

    function setPrice(uint256 _price) external onlyManage {
        price = _price;
        emit SetPrice(msg.sender, _price);
    }


    function setETHPrice(uint256 _price) external onlyManage {
        ethprice = _price;
        emit SetPrice(msg.sender, _price);
    }

    function leftBalance() public view returns(uint) {
        return mfuel.balanceOf(address(this));
    }

    function takeBackMfuel(address recipient) external onlyManage {
        uint256 amount = leftBalance();
        mfuel.transfer(recipient, amount);

        emit TacKBack(recipient, amount, block.timestamp);
    }

    function takeBackMfuel(address recipient, address token) external onlyManage {
        uint256 amount = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(recipient, amount);

        emit TacKBack(recipient, amount, block.timestamp);
    }

}















