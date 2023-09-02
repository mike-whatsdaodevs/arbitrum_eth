// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interface/INFTProperty.sol";
import "./interface/IMinerNFT.sol";
import "./owner/Operator.sol";

contract NFTFactory is Pausable, Ownable {
    IMinerNFT public NFTMiner;

    INFTProperty public repository;

    constructor(address minerContract, address repositoryContract) {
        NFTMiner = IMinerNFT(minerContract);
        repository = INFTProperty(repositoryContract);
    }

    function pause() external virtual onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() external virtual onlyOwner whenPaused {
        _unpause();
    }

    function setNFTMiner(address minerAddress) external onlyOwner {
        NFTMiner = IMinerNFT(minerAddress);
        emit SetNFTMiner(minerAddress);
    }

    function setRepository(address repositoryAddress) external onlyOwner {
        repository = INFTProperty(repositoryAddress);
        emit SetRepository(repositoryAddress);
    }

    function buildMiner(uint256[] calldata properties, address target)
        external
        whenNotPaused
        onlyOwner
        returns (uint256)
    {
        uint256 id = NFTMiner.mint(target);
        repository.addProperty(id, properties);
        return id;
    }

    /* ========== EVENTS ========== */
    event SetNFTMiner(address indexed minerAddress);
    event SetRepository(address indexed repositoryAddress);
}
