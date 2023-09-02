// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

interface INFTProperty {
    function addProperty(uint256 id, uint256[] calldata properties) external;

    function removeProperty(uint256 id) external;

    function getHashRate(uint256 id) external view returns (uint256 hashRate);

    function getConsumption(uint256 id)
        external
        view
        returns (uint256 consumption);

    function getCreateTime(uint256 id) external view returns (uint256 time);
}
