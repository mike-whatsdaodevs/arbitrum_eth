// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BTCCToken is ERC20, Pausable, Ownable {
    constructor() ERC20("WBTC", "WBTC") {}

    function mint(address account, uint256 amount)
        external
        onlyOwner
        whenNotPaused
        returns (bool)
    {
        super._mint(account, amount);
        return true;
    }

    function burn(uint256 amount) external onlyOwner whenNotPaused returns (bool) {
        super._burn(_msgSender(), amount);
        return true;
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }
}
