// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./../owner/Manage.sol";
import "hardhat/console.sol";

pragma solidity 0.8.6;



// ZEON GT1X
// ZEON GT10X
// ZEON GT100X
/// https://nft.bitcoincode.technology/ZeonGT100X/1
contract NFTMiner is ERC721Enumerable, Manage, Pausable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string public baseURI;

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _uri
    ) 
        ERC721(_name, _symbol) 
    {
        setBaseURI(_uri);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory baseURI_) public virtual onlyOwner {
        baseURI = baseURI_;
        emit SetBaseURI(baseURI_, msg.sender);
    }

    function mint(address player) external onlyManage returns (uint256) {
        _tokenIds.increment();
        uint256 id = _tokenIds.current();
        _mint(player, id);
        return id;
    }

    function burn(uint256 tokenId) external virtual {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        _burn(tokenId);
    }

    /**
     * @dev See {ERC721-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        require(!paused(), "ERC721Pausable: token transfer while paused");
    }

    function pause() external virtual onlyOwner {
        _pause();
        emit SetPause(msg.sender);
    }

    function unpause() external virtual onlyOwner {
        _unpause();
        emit SetUnPause(msg.sender);
    }

    event SetBaseURI(string indexed baseURI, address _owner);
    event SetPause(address _owner);
    event SetUnPause(address _owner);
}
