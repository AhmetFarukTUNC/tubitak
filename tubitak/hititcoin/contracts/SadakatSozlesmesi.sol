// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./HititCoin.sol";

contract LoyaltyProgram {
    HititCoin public token;
    mapping(address => uint256) public loyaltyPoints;
    uint256 public pointsPerToken;

    event PointsEarned(address indexed user, uint256 points);
    event PointsRedeemed(address indexed user, uint256 points, uint256 amount);

    constructor(HititCoin _token, uint256 _pointsPerToken) {
        token = _token;
        pointsPerToken = _pointsPerToken;
    }

    function earnPoints(address user, uint256 amountSpent) public {
        uint256 points = amountSpent * pointsPerToken;
        loyaltyPoints[user] += points;
        emit PointsEarned(user, points);
    }

    function redeemPoints(uint256 points) public {
        require(loyaltyPoints[msg.sender] >= points, "Not enough points");
        uint256 amount = points / pointsPerToken;
        loyaltyPoints[msg.sender] -= points;
        require(token.transfer(msg.sender, amount), "Redemption failed");
        emit PointsRedeemed(msg.sender, points, amount);
    }
}
