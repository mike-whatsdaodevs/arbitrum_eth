// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interface/INFTProperty.sol";
import "./interface/IMinerNFT.sol";
import "./owner/Operator.sol";

contract NFTFactory is Pausable, Ownable {
    mapping(address => bool) public minerList;
    mapping(address => uint256[]) public propertiesList;
    mapping(address => mapping(address => uint256)) public whitelist;

    modifier onlyValidMiner(address miner) {
        require(minerList[miner] == true, "E: miner is not valid");
        _;
    }


    INFTProperty public property;

    constructor(address propertyContract) {
        property = INFTProperty(propertyContract);
    }

    function pause() external virtual onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() external virtual onlyOwner whenPaused {
        _unpause();
    }

    function setNFTMiner(address minerAddress, bool status, uint256[] calldata properties) external onlyOwner {
        minerList[minerAddress] = status;
        propertiesList[minerAddress] = properties;
    }

    function setProperty(address propertyAddress) external onlyOwner {
        property = INFTProperty(propertyAddress);
        emit SetProperty(propertyAddress);
    }

    function buildMiner(address nftAddr, address target)
        internal
        returns (uint256)
    {
        uint256 id = IMinerNFT(nftAddr).mint(target);
        property.addProperty(nftAddr, id, propertiesList[nftAddr]);
        return id;
    }

    function batchBuildMiner(
        address nftAddr, 
        address target, 
        uint256 amount
    )
        public
        whenNotPaused
        onlyOwner
        onlyValidMiner(nftAddr)
        returns (uint256[] memory)
    {
        require(amount != 0, "E: amount can't be zero");

        uint256[] memory ids = new uint256[](amount);
        for(uint i = 0; i < amount; i ++) {
            ids[i] = buildMiner(nftAddr, target);
        }
        return ids;
    }   

    function addWhiteList(address addr, address nftAddr, uint256 amount) external onlyOwner {
        require(addr != address(0), "E: address can't be zero");

        whitelist[nftAddr][addr] += amount;
    }

    function mintWhiteList(
        address nftAddr, 
        uint256 amount
    ) 
        external
        whenNotPaused
        onlyValidMiner(nftAddr) 
    {
        uint256 whitelistAmount = whitelist[nftAddr][msg.sender];
        require(amount <= whitelistAmount, "E: amount is too large");

        for(uint i = 0; i < amount; i ++) {
            buildMiner(nftAddr, msg.sender);
        }

        whitelist[nftAddr][msg.sender] -= amount;
    }

    /* ========== EVENTS ========== */
    event SetNFTMiner(address indexed minerAddress);
    event SetProperty(address indexed propertyAddress);
}
