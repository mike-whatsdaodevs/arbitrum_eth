// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interface/INFTProperty.sol";
import "./interface/IMinerNFT.sol";
import "./owner/Operator.sol";

contract NFTFactory is Pausable, Ownable {
    mapping(address => bool) public minerList;

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

    function setNFTMiner(address minerAddress, bool status) external onlyOwner {
        minerList[minerAddress] = status;
    }

    function setProperty(address propertyAddress) external onlyOwner {
        property = INFTProperty(propertyAddress);
        emit SetProperty(propertyAddress);
    }

    function buildMiner(address nftAddr, uint256[] calldata properties, address target)
        public
        whenNotPaused
        onlyOwner
        onlyValidMiner(nftAddr)
        returns (uint256)
    {
        uint256 id = IMinerNFT(nftAddr).mint(target);
        property.addProperty(nftAddr, id, properties);
        return id;
    }

    function batchBuildMiner(
        address nftAddr, 
        uint256[] calldata properties, 
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
            ids[i] = buildMiner(nftAddr, properties, target);
        }
        return ids;
    }   

    /* ========== EVENTS ========== */
    event SetNFTMiner(address indexed minerAddress);
    event SetProperty(address indexed propertyAddress);
}
