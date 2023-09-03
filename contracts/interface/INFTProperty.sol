// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

interface INFTProperty {
    function addProperty(address nftAddr, uint256 id, uint256[] calldata properties) external;

    function removeProperty(address nftAddr, uint256 id) external;

    function getHashRate(address nftAddr, uint256 id) external view returns (uint256 hashRate);

    function getConsumption(address nftAddr, uint256 id)
        external
        view
        returns (uint256 consumption);

    function getCreateTime(address nftAddr, uint256 id) external view returns (uint256 time);
}
