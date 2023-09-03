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

    uint256 public defaultHashRate;
    uint256 public defaultConsumption;

    /// nft address => nft id ==> property
    mapping(address => mapping(uint256 => Property)) public property;

    constructor() {}

    function addProperty(address nftAddr, uint256 id, uint256[] calldata properties)
        external
        override
        onlyManage
    {
        Property memory pro = Property(
            properties[0],
            properties[1],
            properties[2]
        );
        property[nftAddr][id] = pro;
        emit AddProperty(id);
    }

    function removeProperty(address nftAddr, uint256 id) external override onlyManage {
        emit RemoveProperty(id);
        delete property[nftAddr][id];
    }

    function getHashRate(address nftAddr, uint256 id)
        external
        view
        override
        returns (uint256)
    {   
        // save gas
        uint hashRate = property[nftAddr][id].hashRate;
        if(hashRate == 0) {
            return defaultHashRate;
        }
        return hashRate;
    }

    function getConsumption(address nftAddr, uint256 id)
        external
        view
        override
        returns (uint256)
    {   
        // save gas
        uint256 consumption = property[nftAddr][id].consumption;
        if(consumption == 0) {
            return defaultConsumption;
        }
        return consumption;
    }

    function getCreateTime(address nftAddr, uint256 id)
        external
        view
        override
        returns (uint256 time)
    {
        return property[nftAddr][id].createTime;
    }

    function setDefaultHashRate(uint256 newHashRate) external onlyManage {
        require(newHashRate != 0, "E: hashrate can't be zero");

        defaultHashRate = newHashRate;
    }

    function setDefaultConsumption(uint256 newConsumption) external onlyManage {
        require(newConsumption != 0, "E: consumption can't be zero");

        defaultConsumption = newConsumption;
    }

    event AddProperty(uint256 indexed id);
    event RemoveProperty(uint256 indexed id);
}
