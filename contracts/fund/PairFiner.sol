// SPDX-License-Identifier: MIT
// Decontracts Protocol. @2022
pragma solidity >=0.8.14;

import {IUniswapV3Factory} from "../intergrations/uniswap/IUniswapV3Factory.sol";
import {IUniswapV2Factory} from "../intergrations/uniswap/IUniswapV2Factory.sol";

import {IUniswapV3Pool} from "../intergrations/uniswap/IUniswapV3Pool.sol";
import {OracleLibrary, FullMath} from "../intergrations/uniswap/libraries/OracleLibrary.sol";
import {FixedPoint128} from "../intergrations/uniswap/libraries/FixedPoint128.sol";

import {Enum} from "./Enum.sol";

contract PairFiner {
   // IUniswapV3Factory public immutable factory;
    address public immutable wethAddress;
    uint32 public pricePeriod = 60;
    uint24[] public fees = [100, 500, 3000, 10000];

    /// dex to factory address
    mapping(Enum.DEX => address) public dexFactories;


    function setDexFactory(Enum.DEX dex, address factory) external {
        dexFactories[dex] = factory;
    }

    constructor(address _weth) {
        wethAddress = _weth;
    }

    function getUniswapV3PoolAddress(
        Enum.DEX dex,
        address token0, 
        address token1, 
        uint24[] memory fee
    ) external view returns (address[] memory pools) {
        uint256 length = fee.length;
        pools = new address[](length);


        address factory = dexFactories[dex];

        for(uint i; i < length; ++i) {
            pools[i] = IUniswapV3Factory(factory).getPool(token0, token1, fees[i]);
        }
    }

    function getUniswapV2PoolAddress(
        Enum.DEX dex,
        address token0, 
        address token1
    ) external view returns (address pool) {
        address factory = dexFactories[dex];
        pool = IUniswapV2Factory(factory).getPair(token0, token1);
    }

}
