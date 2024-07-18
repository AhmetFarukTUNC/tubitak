// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./HititCoin.sol";

contract InternationalTransfer {
    HititCoin public token;

    event TransferInitiated(address indexed sender, address indexed receiver, uint256 amount, uint256 transferId);
    event TransferCompleted(address indexed sender, address indexed receiver, uint256 amount, uint256 transferId);

    constructor(HititCoin _token) {
        token = _token;
    }

    function initiateTransfer(address receiver, uint256 amount, uint256 transferId) public {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer initiation failed");
        emit TransferInitiated(msg.sender, receiver, amount, transferId);
    }

    function completeTransfer(address receiver, uint256 amount, uint256 transferId) public {
        require(token.transfer(receiver, amount), "Transfer completion failed");
        emit TransferCompleted(address(this), receiver, amount, transferId);
    }
}
