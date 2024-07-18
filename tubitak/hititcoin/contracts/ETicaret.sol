// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./HititCoin.sol";

contract ECommercePayment {
    HititCoin public token;

    event PaymentReceived(address indexed buyer, address indexed seller, uint256 amount, uint256 orderId);
    event RefundIssued(address indexed seller, address indexed buyer, uint256 amount, uint256 orderId);

    constructor(HititCoin _token) {
        token = _token;
    }

    function pay(address seller, uint256 amount, uint256 orderId) public {
        require(token.transferFrom(msg.sender, seller, amount), "Payment failed");
        emit PaymentReceived(msg.sender, seller, amount, orderId);
    }

    function issueRefund(address buyer, uint256 amount, uint256 orderId) public {
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance for refund");
        require(token.transfer(buyer, amount), "Refund failed");
        emit RefundIssued(msg.sender, buyer, amount, orderId);
    }
}
