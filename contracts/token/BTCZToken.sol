// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BTCZToken is ERC20 {
    constructor(address _owner) ERC20("BTCZ", "BTCZ") {
        super._mint(_owner, 21e24);
    }
}
