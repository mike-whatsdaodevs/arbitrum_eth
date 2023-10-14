// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../owner/Manage.sol";

contract BFuelToken is ERC20, Manage {
    constructor() ERC20("BFUEL", "BFUEL") {
        super._mint(msg.sender, 100_000_000 * 1E18);
    }

    function mint(address account, uint256 amount)
        external
        onlyManage
        returns (bool)
    {
        super._mint(account, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        super._burn(_msgSender(), amount);
        return true;
    }

}