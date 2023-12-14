// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NodeToken is ERC20, Pausable, Ownable {
    constructor() ERC20("NODE", "NODE") {}

    function mint(address account, uint256 amount)
        external
        onlyOwner
        whenNotPaused
    {
        super._mint(account, amount);
    }

    function burn(address account, uint256 amount) 
        external 
        onlyOwner 
        whenNotPaused 
    {
        super._burn(account, amount);
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }
}
