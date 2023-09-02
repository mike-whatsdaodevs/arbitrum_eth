// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract MarketPlace is Context, ERC721Holder, Ownable, Pausable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address => EnumerableSet.UintSet) private _holderTokens;
    mapping(uint256 => NFT) private _tokenOwners;

    mapping(address => bool) private _supportedBaseToken;
    address usdt;
    address btcz;
    uint256 public usdtPrice = 2e20;
    uint256 public btczPrice = 2e20;
    IERC721 public nft;
    uint256 public fee = 3;
    address public pool;
    uint8 mode = 0;

    struct NFT {
        uint256 tokenId;
        uint256 price;
        address baseToken;
        uint256 giftCode;
        address payable owner;
    }

    /* ========== CONSTRUCTOR ========== */
    constructor(
        address _usdt,
        address _btcz,
        address _addr,
        address _pool
    ) {
        usdt = _usdt;
        btcz = _btcz;
        _supportedBaseToken[_usdt] = true;
        _supportedBaseToken[_btcz] = true;
        nft = IERC721(_addr);
        pool = _pool;
    }

    function setPool(address _pool) external onlyOwner {
        emit SetPool(_pool);
        pool = _pool;
    }

    function setFee(uint256 _fee) external onlyOwner {
        emit SetFee(_fee);
        require(_fee >= 0, "error");
        fee = _fee;
    }

    function setBaseToken(address addr, bool isSupported) external onlyOwner {
        emit SetBaseToken(addr, isSupported);
        require(addr != address(0), "address is zero");
        _supportedBaseToken[addr] = isSupported;
    }

    function setNFT(address addr) external onlyOwner {
        emit SetNFT(addr);
        require(addr != address(0), "address is zero");
        nft = IERC721(addr);
    }

    function setUSDT(address addr, uint256 _price) external onlyOwner {
        emit SetUSDT(addr);
        require(addr != address(0), "address is zero");
        usdt = addr;
        usdtPrice = _price;
    }

    function setBTCZ(address addr, uint256 _btczPrice) external onlyOwner {
        emit SetBTCZ(addr);
        require(addr != address(0), "address is zero");
        btcz = addr;
        btczPrice = _btczPrice;
    }

    function setMode(uint8 _mode) external onlyOwner {
        emit SetMode(_mode);
        mode = _mode;
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(
            owner != address(0),
            "NFTStore: balance query for the zero address"
        );

        return _holderTokens[owner].length();
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        return _holderTokens[owner].at(index);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _tokenOwners[tokenId].owner;
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

    function sell(
        uint256 tokenId,
        address baseToken,
        uint256 giftCode,
        uint256 price
    ) public whenNotPaused {
        emit Sell(tokenId);
        require(_supportedBaseToken[baseToken], "Not supported baseToken");
        if (mode == 1) {
            if (baseToken == usdt) {
                price = usdtPrice;
            }
            if (baseToken == btcz) {
                price = btczPrice;
            }
        }
        NFT memory newNFT = NFT({
            tokenId: tokenId,
            price: price,
            baseToken: baseToken,
            giftCode: giftCode,
            owner: payable(_msgSender())
        });

        nft.safeTransferFrom(_msgSender(), address(this), tokenId);
        _holderTokens[_msgSender()].add(tokenId);
        _tokenOwners[tokenId] = newNFT;
    }

    function buy(uint256 tokenId, uint256 giftCode)
        public
        payable
        whenNotPaused
    {
        emit Buy(tokenId);
        NFT memory tokenNFT = _tokenOwners[tokenId];
        require(
            tokenNFT.owner != address(0),
            "NFTStore: operator query for nonexistent token"
        );
        require(
            tokenNFT.giftCode == giftCode,
            "NFTStore: giftCode not correct"
        );
        IERC20 baseToken = IERC20(tokenNFT.baseToken);
        uint256 price = tokenNFT.price;
        uint256 tradeFee = price.mul(fee).div(100);
        baseToken.transferFrom(_msgSender(), pool, tradeFee);
        baseToken.transferFrom(
            _msgSender(),
            tokenNFT.owner,
            price.sub(tradeFee)
        );
        nft.safeTransferFrom(address(this), _msgSender(), tokenId);
        _holderTokens[tokenNFT.owner].remove(tokenId);
        delete _tokenOwners[tokenId];
    }

    function unlock(uint256 tokenId) public {
        emit Unlock(tokenId);
        NFT memory tokenNFT = _tokenOwners[tokenId];
        require(
            tokenNFT.owner != address(0),
            "NFTStore: operator query for nonexistent token"
        );
        require(
            tokenNFT.owner == _msgSender(),
            "NFTStore: transfer of token that is not own"
        );
        nft.safeTransferFrom(address(this), _msgSender(), tokenId);
        _holderTokens[_msgSender()].remove(tokenId);
        delete _tokenOwners[tokenId];
    }

    function back(address target, uint256 tokenId) public onlyOwner {
        require(
            _tokenOwners[tokenId].owner == address(0),
            "NFTStore:token is locked"
        );
        nft.safeTransferFrom(address(this), target, tokenId);
    }

    function getNFT(uint256 tokenId)
        public
        view
        returns (
            address baseToken,
            uint256 price,
            bool hasGiftCode,
            address owner
        )
    {
        NFT memory tokenNFT = _tokenOwners[tokenId];
        require(
            tokenNFT.owner != address(0),
            "NFTStore: operator query for nonexistent token"
        );
        price = tokenNFT.price;
        owner = tokenNFT.owner;
        baseToken = tokenNFT.baseToken;
        if (tokenNFT.giftCode == 0) {
            hasGiftCode = false;
        } else {
            hasGiftCode = true;
        }
        return (baseToken, price, hasGiftCode, owner);
    }

    function isSupportedBaseToken(address tokenId) public view returns (bool) {
        return _supportedBaseToken[tokenId];
    }

    event SetPool(address indexed pool);
    event SetFee(uint256 indexed fee);
    event SetMode(uint8 indexed mode);
    event SetBaseToken(address indexed token, bool isSupoorted);
    event SetNFT(address indexed nft);
    event SetUSDT(address indexed addr);
    event SetBTCZ(address indexed addr);
    event Sell(uint256 indexed id);
    event Buy(uint256 indexed id);
    event Unlock(uint256 indexed id);
}
