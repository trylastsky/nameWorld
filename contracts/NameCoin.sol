// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NameCoin is ERC20 {

    address payable public owner;
    uint price = 100; // цена за 1000 токенов

    constructor() ERC20("NameCoin", "NC") {
        owner = payable(msg.sender);
        uint _totalSupply = 1000000000; // 10 000 000 tokens
        _mint(owner, _totalSupply);
    }

    function mint(uint _value) public {
        require(msg.sender == owner, "you not owner@!");
        _mint(owner, _value);
    }

    
//     function buyToken(uint256 _value) public payable {
//     uint256 tokenAmount = _value * 1000;    // Вычисляем количество токенов для передачи
//     uint256 ethValue = _value * 1 ether;  // Проверяем, что отправленное количество ETH достаточно для покупки токенов
//     require(msg.value >= ethValue, "Insufficient ETH sent");
//     _transfer(owner, msg.sender, tokenAmount);    // Выполняем перевод токенов
//     owner.transfer(msg.value);  // Переводим эфирные средства на адрес владельца контракта
   

// }



  
}

