// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

import {IV2SwapRouter} from "../interfaces/IV2SwapRouter.sol";
import {IV3SwapRouter} from "../interfaces/IV3SwapRouter.sol";
import {ISwapRouter02} from "../interfaces/ISwapRouter02.sol";
import {IMulticallExtended} from "../interfaces/IMulticallExtended.sol";

library UniswapAdapter {

    function uniswapV2(
        address uniswapRouter,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        uint256 value
    ) internal returns (uint256 amountOut) {

        (bool success, bytes memory data) = 
            uniswapRouter.call {value: value} (
                abi.encodeWithSelector(
                    IV2SwapRouter.swapExactTokensForTokens.selector, 
                    amountIn, 
                    amountOutMin, 
                    path,
                    address(this)
            )
        );
        
        require(success, 'V2 ERROR');
                   
        return abi.decode(data, (uint256));
    }

    function uniswapV3Single(
        address uniswapRouter,
        ISwapRouter02.ExactInputSingleParams calldata params,
        uint256 value
    ) internal returns (uint256 amountOut) {
        (bool success, bytes memory data) = uniswapRouter.call {value: value} (
            abi.encodeWithSelector(
                IV3SwapRouter.exactInputSingle.selector, 
                params
            )
        );
        
        require(success, 'V2 ERROR');

        return abi.decode(data, (uint256));
    }

    function uniswapV3(
        address uniswapRouter,
        ISwapRouter02.ExactInputParams calldata params,
        uint256 value
    ) internal returns (uint256 amountOut) {
        (bool success, bytes memory data) = uniswapRouter.call {value: value} (
            abi.encodeWithSelector(
                IV3SwapRouter.exactInput.selector, 
                params
            )
        );
        
        require(success, 'V2 ERROR');

        return abi.decode(data, (uint256));
    }

    // function multicall(uint256 deadline, bytes[] calldata data) external payable returns (bytes[] memory results);

    function uniMulticall(
        address uniswapRouter,
        bytes[] calldata params, 
        uint256 value
    ) internal returns (bytes[] memory results) {
        (bool success, bytes memory data) = uniswapRouter.call {value: value} (
            abi.encodeWithSelector(
                IMulticallExtended.multicall.selector, 
                block.timestamp,
                params
            )
        );
        
        require(success, 'V2 ERROR');

        results = abi.decode(data, (bytes[]));
    }
}
