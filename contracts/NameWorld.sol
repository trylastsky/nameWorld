// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NameWorld is ERC721 {

    address owner;

    struct NameNft {
        string name;
    }

    uint[] public allIdTokens; // 

    mapping(uint => NameNft) public idNftMap; //
    mapping(string => bool) public statusName; //статус имени чтобы его не заняли больше
    mapping(address => uint[]) public userNft; // nft токены пользователя

    constructor() ERC721("NameNFT", "NFT")  {
        owner = msg.sender; //назначаем owner
        userNft[owner].push(allIdTokens.length); //добавляем id token в мапинг 
        idNftMap[allIdTokens.length] = NameNft("Trylastsky"); //
        statusName["Trylastsky"] = true; // делаем имя забронированным
        _mint(owner, allIdTokens.length);// переводим ему nft токен
        allIdTokens.push(allIdTokens.length);//добавляем в общий массив id токена
    }

    function lengthUserNft() view public returns(uint) { //длина мапинга id токенов юзера
        return(userNft[msg.sender].length);
    }

        function mintToken(string memory _name) public {
        require(statusName[_name] == false, "this name already used");
        userNft[msg.sender].push(allIdTokens.length); //добавляем id token в мапинг юзера
        idNftMap[allIdTokens.length] = NameNft(_name); // добавляем само nft в ключ значение
        statusName[_name] = true; // делаем имя забронированным
        _mint(msg.sender, allIdTokens.length);// переводим ему nft токен
        allIdTokens.push(allIdTokens.length);//добавляем в общий массив id токена
    }


}   