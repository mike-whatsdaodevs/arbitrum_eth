// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

import {IQuoterV2} from "../intergrations/uniswap/IQuoterV2.sol";
import {UniswapV2Library} from "../intergrations/uniswap/libraries/UniswapV2Library.sol";
import {SushiV2Library} from "../intergrations/uniswap/libraries/SushiV2Library.sol";
import {IUniswapV2Router02} from "../intergrations/uniswap/IUniswapV2Router02.sol";
import {UniswapAdapter, ISwapRouter02} from "./UniswapAdapter.sol";
import {IV2SwapRouter} from "../interfaces/IV2SwapRouter.sol";
import {IV3SwapRouter} from "../interfaces/IV3SwapRouter.sol";
import {TransferHelper, IERC20} from "./TransferHelper.sol";


contract PoolsPrice {

    using UniswapAdapter for address;
    using TransferHelper for address;

    address public weth9;

    uint24[] private fees = [100, 500, 3000, 10000];

    constructor(address _weth) {
        weth9 = _weth;
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
        IQuoterV2 quoter,
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
        IQuoterV2 quoter,
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

    function getUniswapV2AmountsOut(
        address uniswapV2Factory,
        address[] memory path,
        uint256 amount
    ) public view returns (uint256[] memory amountsOut) {
        amountsOut = UniswapV2Library.getAmountsOut(uniswapV2Factory, amount, path);
    }

    function getSushiV2AmountOut(
        address uniswapV2Factory,
        address token0,
        address token1,
        uint256 amount
    ) public view returns (uint256 amountOut) {
        (uint reserve0, uint reserve1) = SushiV2Library.getReserves(uniswapV2Factory, token0, token1);
        amountOut = SushiV2Library.getAmountOut(amount, reserve0, reserve1);
    }

    function getSushiV2AmountsOut(
        address uniswapV2Factory,
        address[] memory path,
        uint256 amount
    ) public view returns (uint256[] memory amountsOut) {
        amountsOut = SushiV2Library.getAmountsOut(uniswapV2Factory, amount, path);
    }

    function swapV2(
        address uniswapRouter,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to
    ) public payable returns (uint256) {
        require(path.length >= 2, "PA6");
        uint256 amountOut = uniswapRouter.uniswapV2(amountIn, amountOutMin, path, to, msg.value);
        return amountOut;
    }

    function swapV3Single(
        address uniswapRouter,
        ISwapRouter02.ExactInputSingleParams calldata params
    ) external payable returns (uint256) {
        uint256 amountOut = uniswapRouter.uniswapV3Single(params, msg.value);
        return amountOut;
    }

    function swapV3ExactInput(
        address uniswapRouter,
        ISwapRouter02.ExactInputParams calldata params
    ) external payable returns (uint256) {
        uint256 amountOut = uniswapRouter.uniswapV3(params, msg.value);
        return amountOut;
    }


    function safeApprove(address token, address protocol) external {
        token.safeApprove(protocol, type(uint256).max);
    }


    function swapSingleCall(
        uint256[] memory protocolTypes,
        address[] memory routers,
        bytes[] memory paths,
        address token,
        uint256 amountIn
    ) external payable returns (uint256 amountOut) {
        if (token != weth9 || msg.value == 0) {
            token.safeTransferFrom(msg.sender, address(this), amountIn);
        }
        uint256 value = msg.value;
        uint256 length = protocolTypes.length;
        for(uint256 i; i < length; i ++) {
            uint256 protocolType = protocolTypes[i];
            if(protocolType == 2) {
                address[] memory v2Path = abi.decode(paths[i], (address[]));
                amountOut = routers[i].uniswapV2(amountIn, 0, v2Path, address(this), value);
            }
            if(protocolType == 3) {
                IV3SwapRouter.ExactInputParams memory params = IV3SwapRouter.ExactInputParams(
                    paths[i], 
                    address(this),
                    amountIn,
                    0
                );
                amountOut = routers[i].uniswapV3(params, value);
            }
            amountIn = amountOut;
            value = 0;
        }
    }

    function encodeV2Calldata(uint256 amountIn, address[] memory path) public view returns (bytes memory data) {
        return abi.encodeCall(
            IV2SwapRouter.swapExactTokensForTokens,
            (
                amountIn,
                0,
                path,
                address(this)
            )
        );
    }

    function encodeV3Calldata(uint256 amountIn, bytes memory path) public view returns (bytes memory data) {
        IV3SwapRouter.ExactInputParams memory params = IV3SwapRouter.ExactInputParams(
            path, 
            address(this),
            amountIn,
            0
        );
        return abi.encodeCall(
            IV3SwapRouter.exactInput,
            (
                params
            )
        );
    }

     /// force withdraw token balance
    function recovery(address token, address recipient) external {
        uint256 balance = IERC20(token).balanceOf(address(this));
        token.safeTransfer(recipient, balance);
    }

}















