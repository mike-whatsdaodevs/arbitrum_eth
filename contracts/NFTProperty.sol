// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import "./interface/INFTProperty.sol";
import "./owner/Manage.sol";

contract NFTProperty is INFTProperty, Manage {
    struct Property {
        uint256 hashRate;
        uint256 consumption;
        uint256 createTime;
    }

    mapping(uint256 => Property) public property;

    function addProperty(uint256 id, uint256[] calldata properties)
        external
        override
        onlyManage
    {
        Property memory pro = Property(
            properties[0],
            properties[1],
            properties[2]
        );
        property[id] = pro;
        emit AddProperty(id);
    }

    function removeProperty(uint256 id) external override onlyManage {
        emit RemoveProperty(id);
        delete property[id];
    }

    function getHashRate(uint256 id)
        external
        view
        override
        returns (uint256 hashRate)
    {
        return property[id].hashRate;
    }

    function getConsumption(uint256 id)
        external
        view
        override
        returns (uint256 consumption)
    {
        return property[id].consumption;
    }

    function getCreateTime(uint256 id)
        external
        view
        override
        returns (uint256 time)
    {
        return property[id].createTime;
    }

    event AddProperty(uint256 indexed id);
    event RemoveProperty(uint256 indexed id);
}
