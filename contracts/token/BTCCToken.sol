// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BTCCToken is ERC20 {
    constructor(address _owner) ERC20("BTCC", "BTCC") {
        super._mint(_owner, 21e24);
    }
}
