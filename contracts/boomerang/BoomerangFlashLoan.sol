// SPDX-License-Identifier: MIT
pragma solidity =0.8.10 <= 0.8.20;

import {FlashLoanSimpleReceiverBase} from "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TransferHelper} from "../TransferHelper.sol";

interface IuniswapV3 {

    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

interface IV2SwapRouter {

    struct SushiswapParams {
        address tokenIn;
        address tokenOut;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 limitSqrtPrice;
    }

    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function exactInputSingle(SushiswapParams calldata params) external payable returns (uint256 amountOut);

}

contract BoomerangFlashLoan is FlashLoanSimpleReceiverBase, Ownable {
    using TransferHelper for address;

    enum dexList {
        uniswapV2,
        uniswapV3,
        paraswap,
        quickwap
    }

    uint8[] dexPath;
    address[] pairs;
    address[] currentpairs;

    address sushiSwapAddress;
    address uniswapv3Address;
    address qucikswapAddress;

    mapping(address => bool) public managers;

    address public BoomerangController;

    event WithdrawFund(address indexed token, address indexed to, uint256 amount, uint256 timestamp);
    event SetManager(address indexed token, bool status, uint256 timestamp);

    modifier onlyManager {
        require(managers[msg.sender] == true, "E: caller is invalid");
        _;
    }

    constructor(
        address _addressProvider, 
        address _uniswapv3Address,
        address _quickswapAddress, 
        address _sushiswapAddress
    ) 
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
       uniswapv3Address = _uniswapv3Address;
       qucikswapAddress = _quickswapAddress;
       sushiSwapAddress = _sushiswapAddress;

       managers[msg.sender] = true;
    }

    receive() external payable {}

    function withdrawFunds(address token, uint256 amount) external onlyOwner {
        require(amount != 0, "E: amount should be greater than zero");
        token.safeTransfer(msg.sender, amount);

        emit WithdrawFund(token, msg.sender, amount, block.timestamp);
    }

    function swapTokens(uint256 amount) public {
        require((pairs.length) - 1 == dexPath.length, "invalid trx");

        for (uint i = 0; i < dexPath.length; i++)
        {

            if(dexList(dexPath[i]) == dexList.uniswapV3) {
                amount = uniswapV3(pairs[i], pairs[i+1], amount);
            }

            if(dexList(dexPath[i]) == dexList.paraswap) {
                amount = uniswapV3(pairs[i], pairs[i+1], amount);
            }
            
            if(dexList(dexPath[i]) == dexList.quickwap) {
                amount = quickSwap(pairs[i], pairs[i+1], amount);
            }
        }
    }

    function uniswapV3(address tokenIn, address tokenOut, uint256 amount) public returns(uint256) {
        tokenIn.safeApprove(uniswapv3Address, amount);
        IuniswapV3.ExactInputSingleParams memory params = IuniswapV3.ExactInputSingleParams(
            {
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp + 86400,
                amountIn: amount,
                amountOutMinimum: 0,     //slippage
                sqrtPriceLimitX96: 0
            }
        );

        uint256 amountOut = IuniswapV3(uniswapv3Address).exactInputSingle(params);
        return amountOut;

    }

    function sushiswap(address tokenIn, address tokenOut, uint256 amount) public  returns(uint256[] memory) {
        tokenIn.safeApprove(sushiSwapAddress, amount);
        address[] memory pair = new address[](2);
        pair[1] = tokenIn;
        pair[2] = tokenOut; 
        uint256[] memory  amounts = IV2SwapRouter(sushiSwapAddress).swapTokensForExactTokens(
                amount,
                0,
                pair,
                address(this),
                block.timestamp + 86400
            );
        return amounts;
        
    }

    function quickSwap(address tokenIn, address tokenOut, uint256 amount) public returns(uint256){
        tokenIn.safeApprove(qucikswapAddress, amount);
        IV2SwapRouter.SushiswapParams memory params =
            IV2SwapRouter.SushiswapParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                recipient: address(this),
                deadline: block.timestamp + 86400,
                amountIn: amount,
                amountOutMinimum: 0,
                limitSqrtPrice: 0
            });

        uint256 amountOut = IV2SwapRouter(qucikswapAddress).exactInputSingle(params);
        return amountOut;
        
    }

    /**
        This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        swapTokens(amount);
        uint256 amountOwed = amount + premium;
        asset.safeApprove(address(POOL), amountOwed);
        return true;
    }

    function requestFlashLoan(
        address token, 
        uint256 amount, 
        uint8[] memory path, 
        address[] memory poolPairs, 
        uint256 profit
    ) 
        public 
        onlyManager 
    {
        POOL.flashLoanSimple(
            address(this),
            token,
            amount,
            "",
            0
        );

        dexPath = path;
        pairs = poolPairs;

        if(profit > 0){
            token.safeTransfer(msg.sender, profit);

        }
    }

    function setManager(address addr, bool status) external onlyOwner {
        managers[addr] = status;
        emit SetManager(addr, status, block.timestamp);
    }
}






