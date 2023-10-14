// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;

import "./TransferHelper.sol";

contract Airdrop {

    using TransferHelper for address;

    uint256 basePrice = 0.017 ether;

    receive() external payable {}

    function batchAirdop(
        address[] calldata targets,
        uint256[] calldata amounts
    )   
        public
        payable
    {
        uint256 len = targets.length;
        for(uint i; i < len; ++ i) {
            airdrop(targets[i], amounts[i]);
        }
    }

    function airdrop(
        address target, 
        uint256 amount
    )
        public
        payable
    {
        require(amount != 0, "E: amount can't be zero");

        uint256 price = basePrice * amount;
        target.safeTransferETH(price);
    }   

    function tackBack() external {
        msg.sender.safeTransferETH(address(this).balance);
    }
}
