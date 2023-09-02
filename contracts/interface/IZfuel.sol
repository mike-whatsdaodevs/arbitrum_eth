// SPDX-License-Identifier: MIT
// ERC721A Contracts v4.1.0
// Creator: Chiru Labs

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IZfuel is IERC20 {
    function burn(uint256 amount) external returns (bool);
}
