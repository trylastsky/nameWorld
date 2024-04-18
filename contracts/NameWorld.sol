// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "./NameCoin.sol"; //импорт стандарта токена NC
import "./NameNft.sol"; //импорт стандарта токена NNFT

contract NameWorld { //main контракт
    NameCoin public NC; //внедрение интерфейса NameCoin
    NameNft public NNFT; //внедрение интерфейса NameNft

    struct NameNftStruct { //структура нашей NFT
        string name; //здесь лежит само имя
    }

    address payable public owner; // назначаем адресс владельца
    uint256 constant TOKEN_PRICE = 1 ether; // Цена одного токена NC в эфирах

    uint[] public allIdTokens; //массив всех токенов
    uint[] public saleNFTMas; //массив NFT выставленных на продажу

    mapping(uint => NameNftStruct) public idNftMap; //маппинг где лежит по значению сам токен nft
    mapping(uint => bool) public statusToSale; //статус продажи той или иной nft
    // mapping(string => uint) public idForString; // для получения айди токена по его строке
    mapping(string => bool) public statusName; //статус имени чтобы его не заняли больше
    mapping(address => uint[]) public userNft; // nft токены пользователя


    constructor(address _NCAddress, address _NNFTAddress) { // вводим NC и NFT
        NC = NameCoin(_NCAddress); // вводим Interface NC
        NNFT = NameNft(_NNFTAddress); //вводим Interface NNFT
        owner = NC.owner(); //Назначаем овнера
    }

    function mintNC(uint _value) public { //функция для выпуска монет владельцом
        require(msg.sender == owner, "you not owner@!");
        NC.mint(_value);
    }

    function transferNC (address _to, uint _value) public { //отправка токенов NC на другой адресс
        NC.transfer(msg.sender, _to, _value);
    }

    function buyNC() public payable { // функция покупки пользователем NC , 1 ETH = 1000 NC
        require(msg.value >= TOKEN_PRICE, "Insufficient Ether sent"); // Проверяем, что отправлено достаточное количество эфиров
        uint256 tokensToTransfer = msg.value / TOKEN_PRICE * 1000; // Вычисляем количество токенов для передачи
        owner.transfer(msg.value); // Переводим эфирные средства на адрес владельца контракта
        NC.transfer(owner, msg.sender, tokensToTransfer);
    }

    function balanceNC(address _address) public view returns (uint balance) { //баланс в NC token
        balance = NC.balanceOf(_address);
    }

    function totalSupplyNC() public view returns (uint total) {// общее колво выпущенных токенов NC
        total = NC.totalSupply();
    }

    function symbolNC() public view returns(string memory symbol ) { //символ токена NC
        symbol = NC.symbol();
    }


    //функция выпуска NFT
    function mintNNFT (string memory _name) public {
        require(statusName[_name] == false, "this name already used");
        require(balanceNC(msg.sender) >= 100, "your NC < 100");
        statusName[_name] = true; // делаем имя забронированным
        if (msg.sender == owner) { //если пользователь владелец то не списывается NC
            NNFT.mint(allIdTokens.length); //выпускаем токен
        } else { //если обычный пользователь
            transferNC(owner, 100); //плата за выпуск 1 nft = 100 NC
            NNFT.mint(allIdTokens.length); //выпуск токена
        }
        //Общий исход создания NNFT
        statusToSale[allIdTokens.length] = false; // ставим статус продажи false
        idNftMap[allIdTokens.length] = NameNftStruct(_name); // добавляем само nft в ключ значение
        userNft[msg.sender].push(allIdTokens.length); //добавляем id token в мапинг юзера
        allIdTokens.push(allIdTokens.length);//добавляем в общий массив id токена
        
    }

    function safeTransferFrom(address _to, uint _tokenId) public { //перевод токена другому юзеру
        NNFT.safeTransferFrom(msg.sender, _to, _tokenId);
    }

    function balanceNNFT(address _address) public view returns (uint balance) { //функция для показа баланса nnft
        balance = userNft[_address].length;
    }

    function ownerNNFT(uint _value) public view returns (address _adr) {
        _adr = NNFT.ownerOf(_value);
    }

    function symbolNFT() public view returns(string memory symbol) {
        symbol = NNFT.symbol();
    }

    function totalSupplyNFT() public view returns(uint total) {
        total = allIdTokens.length;
    }


}
