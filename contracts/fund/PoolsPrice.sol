// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

import {IQuoterV2} from "../intergrations/uniswap/IQuoterV2.sol";
import {UniswapV2Library} from "../intergrations/uniswap/libraries/UniswapV2Library.sol";
import {IUniswapV2Router02} from "../intergrations/uniswap/IUniswapV2Router02.sol";

contract PoolsPrice {
    IQuoterV2 public quoter;
    uint24[] private fees = [100, 500, 3000, 10000];

    constructor(address _quoter) {
        quoter = IQuoterV2(_quoter);
    }

    function getSinglePath(address token0, address token1, uint24 fee) public view returns (bytes memory path) {
        path = abi.encodePacked(token0, fee, token1);
    }

    function getMultiPath(address[] memory tokens, uint24[] memory fees) public view returns (bytes memory path) {
        uint256 length = tokens.length;
        require(length >= 2, "E: length error");
        path = abi.encodePacked(tokens[0], fees[0], tokens[1]);

        for(uint256 i = 2; i < length; ++i) {
            path = abi.encodePacked(path, fees[i - 1], tokens[i]);
        }
    }

    function getExactInAmountOut(
        bytes memory path,
        uint256 amount
    )
        public
        returns (
            uint256 expectedAmount,
            uint160[] memory sqrtPriceX96AfterList,
            uint32[] memory initializedTicksCrossedList,
            uint256 gasEstimate
        )
    {
        try quoter.quoteExactInput(path, amount) returns (
            uint256 amountOut,
            uint160[] memory afterList,
            uint32[] memory crossedList,
            uint256 gas
        ) {
            expectedAmount = amountOut;
            sqrtPriceX96AfterList = afterList;
            initializedTicksCrossedList = crossedList;
            gasEstimate = gas;
        } catch {}
     
    }


    function getExactInputSingleAmountOut(
        IQuoterV2.QuoteExactInputSingleParams memory params
    ) public returns (
        uint256 eAmount,
        uint160 eSqrtPriceX96After,
        uint32 eInitializedTicksCrossed,
        uint256 eGasEstimate
    ) {
        try quoter.quoteExactInputSingle(params) returns (
            uint256 amountOut,
            uint160 sqrtPriceX96After,
            uint32 initializedTicksCrossed,
            uint256 gasEstimate
        ) {
            eAmount = amountOut;
            eSqrtPriceX96After = sqrtPriceX96After;
            eInitializedTicksCrossed = initializedTicksCrossed;
            eGasEstimate = gasEstimate;
        } catch {}
    }

    function getUniswapV2AmountOut(
        address uniswapV2Factory,
        address token0,
        address token1,
        uint256 amount
    ) public view returns (uint256 amountOut) {
        (uint reserve0, uint reserve1) = UniswapV2Library.getReserves(uniswapV2Factory, token0, token1);
        amountOut = UniswapV2Library.getAmountOut(amount, reserve0, reserve1);
    }

    function getV2Reserves(address uniswapV2Factory, address token0, address token1) public view returns (uint256, uint256) {
        (uint reserve0, uint reserve1) = UniswapV2Library.getReserves(uniswapV2Factory, token0, token1);
        return (reserve0, reserve1);
    }

    function getUniswapV2AmountsOut(
        address uniswapV2Factory,
        address[] memory path,
        uint256 amount
    ) public view returns (uint256[] memory amountsOut) {
        amountsOut = UniswapV2Library.getAmountsOut(uniswapV2Factory, amount, path);
    }

}















