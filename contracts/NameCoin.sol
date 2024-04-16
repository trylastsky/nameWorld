// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameCoin is ERC20 {

    address payable public owner;
    uint price = 1; // цена за 1000 токенов

    constructor() ERC20("NameCoin", "NC") {
        owner = payable(msg.sender);
        uint _totalSupply = 1000000000; // 10 000 000 tokens
        _mint(owner, _totalSupply);
    }

    function mint(uint _value) public {
        require(msg.sender == owner, "you not owner@!");
        _mint(owner, _value);
    }

    function buyToken(uint256 _value) public payable {
    uint256 ethValue = _value * 1 ether; // Преобразование из ETH в wei
    require(msg.value == ethValue, "Insufficient ETH sent");
    owner.transfer(msg.value);  // Пересылка ETH владельцу контракта
    _transfer(owner, msg.sender, _value * 1000);  // Передача ERC721 токенов владельцу контракта

}


} 