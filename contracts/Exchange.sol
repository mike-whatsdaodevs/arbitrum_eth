// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {SafeMathUpgradeable as SafeMath} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "./TransferHelper.sol";

contract Exchange is OwnableUpgradeable, UUPSUpgradeable, PausableUpgradeable {
    using SafeMath for uint256;
    using TransferHelper for address;

    address btcc = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address bfuel;
    address admin;
    address wallet;

    // how much erc20 to 1 bfuel
    uint256 public price = 1E20;
    uint256 constant _1Bfuel = 1E18;

     // how much ETH to 1 bfuel
    uint256 public ethprice;

    constructor() {
        _disableInitializers();
    }

    function initialize(address _bfuel, address _wallet) external initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();

        bfuel = _bfuel;
        wallet = _wallet;

        admin = msg.sender;
    }

    event SetBfuel(address manage, address token);
    event SetPayToken(address manage, address token);
    event SetPrice(address manage, uint256 _price);
    event Swap(address buyer, uint256 _price, uint256 payAmount, uint256 bfuelAmount);
    event TacKBack(address recipient, uint256 amount, uint256 blocktime);

    receive() payable external {
        swapForETH();
    }

    // @dev receive eth to swap Bfuel
    function swapForETH() public payable whenNotPaused {
        uint256 payamount = msg.value;
        uint256 bfuelAmount = payamount.mul(ethprice).div(_1Bfuel);
        bfuel.safeTransfer(msg.sender, bfuelAmount);
        wallet.safeTransferETH(payamount);
        emit Swap(msg.sender, ethprice, payamount, bfuelAmount);
    }

    function setBfuel(address _token) external onlyOwner {
        require(_token != address(0), "token is zero");
        bfuel = _token;
        emit SetBfuel(msg.sender, _token);
    }

    function setETHPrice(uint256 _price) external onlyOwner {
        ethprice = _price;
        emit SetPrice(msg.sender, _price);
    }

    function leftBalance() public view returns(uint) {
        return IERC20(bfuel).balanceOf(address(this));
    }

    function takeBackBfuel(address recipient) external onlyOwner {
        uint256 amount = leftBalance();
        bfuel.safeTransfer(recipient, amount);

        emit TacKBack(recipient, amount, block.timestamp);
    }

    function setWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "address cant be zero");
        wallet = _wallet;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Error");
        _;
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
        onlyAdmin
    { }

}















