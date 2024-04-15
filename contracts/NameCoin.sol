// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameCoin is ERC20 {

    address payable owner;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        owner = payable(msg.sender);
    }

} 