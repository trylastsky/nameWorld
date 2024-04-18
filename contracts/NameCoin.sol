// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameCoin is ERC20 {

    address payable public owner;

    constructor() ERC20("NameCoin", "NC") {
        owner = payable(msg.sender);
        uint _totalSupply = 1000000000; // 10 000 000 tokens
        _mint(owner, _totalSupply); // банк NC составит 10 000 000
    }

    function mint(uint _value) external { // функция выпуска NC
        _mint(owner, _value);
    }

    function transfer(address _from, address _to, uint _value) external { // перевод NC
        _transfer(_from, _to, _value); 
    }


}
