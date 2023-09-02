// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MinerCoin is Ownable, ERC20 {
    uint256 constant Precision = 1 ether;

    using SafeMath for uint256;

    uint256 initNum = 1000;

    constructor() ERC20("MinerToken", "MinerToken") {
        _mint(msg.sender, initNum.mul(Precision));
    }

    /**
     * @dev mint
     *
     * Params:
     * - recipient address
     * - number uint
     */
    function safeMint(address recipient, uint256 number) external onlyOwner {
        require(number > 0, "Cant be 0");

        _mint(recipient, number.mul(Precision));
    }
}
