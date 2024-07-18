
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract HititCoin is ERC20 {
    constructor(uint256 initialSupply) ERC20("Hitit Coin", "HIT") {
        _mint(msg.sender, initialSupply);
    }
}
