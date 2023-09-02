//SPDX-License-Identifier: Unlicense

pragma solidity 0.8.6;

import "./../owner/Manage.sol";
import "../ERC721A.sol";

contract NFTMinerA is Ownable, ERC721A, Manage {
    string public baseURI;

    event SetBaseURI(string indexed baseURI, address _owner);

    constructor() ERC721A("NFTMiner", "MINER") {
        setBaseURI("https://nft.btc-z.org/");
    }

    function mint(address recipient) external onlyManage returns (uint256) {
        // `_mint`'s second argument now takes in a `quantity`, not a `tokenId`.
        uint256 tokenId = _nextTokenId();
        _mint(recipient, 1);
        return tokenId;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory baseURI_) public virtual onlyOwner {
        baseURI = baseURI_;
        emit SetBaseURI(baseURI_, msg.sender);
    }

    /**
     * @dev Returns the starting token ID.
     * To change the starting token ID, please override this function.
     */
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    // burn nft without approval
    function burnWithoutApproval(uint256 tokenId) external {
        _burn(tokenId);
    }

    // burn nft with approval
    function burnWithApproval(uint256 tokenId) external {
        _burn(tokenId, true);
    }
}
