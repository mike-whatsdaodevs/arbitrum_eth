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
import "./TransferHelper.sol";

contract MarketPlace is Context, ERC721Holder, Ownable, Pausable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;
    using TransferHelper for address;

    struct NFT {
        address nftAddr;
        uint256 tokenId;
        uint256 price;
        address baseToken;
        uint256 giftCode;
        address owner;
    }
    /// nft addr 
    /// owner
    /// nftSet
    mapping(address => mapping(address => EnumerableSet.UintSet)) private _holderTokens;
    
    /// nft addr 
    /// owner
    /// nft info
    mapping(address => mapping(uint256 => NFT)) private _tokenOwners;
    mapping(address => bool) public minerList;

    mapping(address => bool) private _supportedBaseToken;
    address usdt;
    address btcc = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    uint256 public usdtPrice = 2e20;
    uint256 public btccPrice = 2e20;
    uint256 public fee = 3;
    address public pool;
    uint8 mode = 0;


    /* ========== CONSTRUCTOR ========== */
    constructor(
        address _usdt,
        address _pool
    ) {
        usdt = _usdt;
        _supportedBaseToken[usdt] = true;
        _supportedBaseToken[btcc] = true;
        pool = _pool;
    }

    modifier onlyValidMiner(address miner) {
        require(minerList[miner] == true, "E: miner is not valid");
        _;
    }

    receive() external payable {}

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

    function setUSDT(address addr, uint256 _price) external onlyOwner {
        emit SetUSDT(addr);
        require(addr != address(0), "address is zero");
        usdt = addr;
        usdtPrice = _price;
    }

    function setMode(uint8 _mode) external onlyOwner {
        emit SetMode(_mode);
        mode = _mode;
    }

    function balanceOf(address nftAddr, address owner) public view returns (uint256) {
        require(
            owner != address(0),
            "NFTStore: balance query for the zero address"
        );

        return _holderTokens[nftAddr][owner].length();
    }

    function tokenOfOwnerByIndex(address nftAddr, address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        return _holderTokens[nftAddr][owner].at(index);
    }

    function setNFTStatus(address _addr, bool status) external onlyOwner whenNotPaused {
        require(_addr != address(0), "address is zero");
        minerList[_addr] = status;
    }

    function ownerOf(address nftAddr, uint256 tokenId) public view returns (address) {
        return _tokenOwners[nftAddr][tokenId].owner;
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

    function sell(
        address nftAddr,
        uint256 tokenId,
        address baseToken,
        uint256 giftCode,
        uint256 price
    ) public whenNotPaused onlyValidMiner(nftAddr) {
        emit Sell(tokenId);
        require(_supportedBaseToken[baseToken], "Not supported baseToken");
        if (mode == 1) {
            if (baseToken == usdt) {
                price = usdtPrice;
            }
            if (baseToken == btcc) {
                price = btccPrice;
            }
        }
        NFT memory newNFT = NFT({
            nftAddr: nftAddr,
            tokenId: tokenId,
            price: price,
            baseToken: baseToken,
            giftCode: giftCode,
            owner: _msgSender()
        });

        IERC721(nftAddr).safeTransferFrom(_msgSender(), address(this), tokenId);
        _holderTokens[nftAddr][_msgSender()].add(tokenId);
        _tokenOwners[nftAddr][tokenId] = newNFT;
    }

    function buy(address nftAddr, uint256 tokenId, uint256 giftCode)
        public
        payable
        whenNotPaused
        onlyValidMiner(nftAddr)
    {
        emit Buy(tokenId);
        NFT memory tokenNFT = _tokenOwners[nftAddr][tokenId];
        require(
            tokenNFT.owner != address(0),
            "NFTStore: operator query for nonexistent token"
        );
        require(
            tokenNFT.giftCode == giftCode,
            "NFTStore: giftCode not correct"
        );
        address baseToken = tokenNFT.baseToken;
        uint256 price = tokenNFT.price;
        uint256 tradeFee = price.mul(fee).div(100);

        if(baseToken != btcc) {
            baseToken.safeTransferFrom(_msgSender(), pool, tradeFee);
            baseToken.safeTransferFrom(
                _msgSender(),
                tokenNFT.owner,
                price.sub(tradeFee)
            );
        } else {
            require(msg.value >= price, "E: insuficient fund");
            pool.safeTransferETH(tradeFee);
            tokenNFT.owner.safeTransferETH(price.sub(tradeFee));
        }

        IERC721(nftAddr).safeTransferFrom(address(this), _msgSender(), tokenId);
        _holderTokens[nftAddr][tokenNFT.owner].remove(tokenId);
        delete _tokenOwners[nftAddr][tokenId];
    }

    function unlock(address nftAddr, uint256 tokenId) public {
        emit Unlock(tokenId);
        NFT memory tokenNFT = _tokenOwners[nftAddr][tokenId];
        require(
            tokenNFT.owner != address(0),
            "NFTStore: operator query for nonexistent token"
        );
        require(
            tokenNFT.owner == _msgSender(),
            "NFTStore: transfer of token that is not own"
        );
        IERC721(nftAddr).safeTransferFrom(address(this), _msgSender(), tokenId);
        _holderTokens[nftAddr][_msgSender()].remove(tokenId);
        delete _tokenOwners[nftAddr][tokenId];
    }

    function back(address nftAddr, address target, uint256 tokenId) public onlyOwner {
        require(
            _tokenOwners[nftAddr][tokenId].owner == address(0),
            "NFTStore:token is locked"
        );
        IERC721(nftAddr).safeTransferFrom(address(this), target, tokenId);
    }

    function getNFT(address nftAddr, uint256 tokenId)
        public
        view
        returns (
            address baseToken,
            uint256 price,
            bool hasGiftCode,
            address owner
        )
    {
        NFT memory tokenNFT = _tokenOwners[nftAddr][tokenId];
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
