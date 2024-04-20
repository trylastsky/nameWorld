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

    uint allIdTokens = 0; //массив всех токенов
    uint[] public saleNFTMas; //массив NFT выставленных на продажу

    mapping(uint => NameNftStruct) public idNftMap; //маппинг где лежит по значению сам токен nft
    mapping(uint => bool) public statusToSale; //статус продажи той или иной nft
    mapping(string => uint) public idForString; // для получения айди токена по его строке
    mapping(string => bool) public statusName; //статус имени чтобы его не заняли больше
    mapping(address => uint[]) public userNft; // nft токены пользователя
    mapping(uint => uint) public priceToken; // цена по которой продается токен


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
        balance = NC.balance(_address);
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
        statusName[_name] = true; // делаем имя забронированным
        if (msg.sender == owner) { //если пользователь владелец то не списывается NC
            NNFT.mint(msg.sender, allIdTokens); //выпускаем токен
        } else { //если обычный пользователь
            require(balanceNC(msg.sender) >= 100, "your NC < 100");
            transferNC(owner, 100); //плата за выпуск 1 nft = 100 NC
            NNFT.mint(msg.sender, allIdTokens); //выпуск токена
        }
        //Общий исход создания NNFT
        idForString[_name] = allIdTokens;
        statusToSale[allIdTokens] = false; // ставим статус продажи false
        idNftMap[allIdTokens] = NameNftStruct(_name); // добавляем само nft в ключ значение
        userNft[msg.sender].push(allIdTokens); //добавляем id token в мапинг юзера
        allIdTokens++;
    }

    function transferNNFT(address _from, address _to, uint _value) public { //перевод токена другому юзеру
        NNFT.transfer(_from, _to, _value); // перевод
        userNft[_to].push(_value); // пушим переведенный nft тому кому перевели
        statusToSale[_value] = false;
        for(uint i = 0; i < userNft[_from].length; i++) {     // Проходим по массиву в прямом порядке
            if(userNft[_from][i] == _value) { // Если найден элемент с значением _value, удаляем его из массива
            userNft[_from][i] = userNft[_from][userNft[_from].length - 1];// Перемещаем последний элемент на место удаляемого
            userNft[_from].pop();   // Удаляем последний элемент массива
            // Выходим из цикла, если хотим удалить только первое вхождение _value
            break;
        }
    }
    }

    function saleNNFT(uint _tokenId, uint _value) public { //продажа своей нфт выставить на продажу
        require(statusToSale[_tokenId] != true, "this nft already saled");
        require(msg.sender == ownerNNFT(_tokenId), "You are not the owner of this token"); //проверка на владельца
        require(_value <= totalSupplyNC() && _value >= 0, "please , enter correctly price");//
        saleNFTMas.push(_tokenId); // пушим в общий массив
        priceToken[_tokenId] = _value; // назначается цена
        statusToSale[_tokenId] = true; //статус продажи true

    }

    function buyNNFT(uint _tokenId) public { //покупка nft
        require(balanceNC(msg.sender) >= priceToken[_tokenId], "not NC");
        address salerToken = ownerNNFT(_tokenId);
        transferNC(salerToken, priceToken[_tokenId]); //перевод NC продавцу
        transferNNFT(salerToken, msg.sender, _tokenId);
        for (uint i = 0; i < saleNFTMas.length; i++) {
        if (saleNFTMas[i] == _tokenId) {
            saleNFTMas[i] = saleNFTMas[saleNFTMas.length - 1];
            saleNFTMas.pop();
            statusToSale[_tokenId] = false;
            break;
            }
        }
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
        total = allIdTokens;
    }

    function saleNFTMasLength() public view returns(uint len) {
        len = saleNFTMas.length;
    }

}
