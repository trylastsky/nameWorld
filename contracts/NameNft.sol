// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NameNft is ERC721 {


    constructor() ERC721("NameNFT", "NNFT")  {
    }

    function mint(uint _allIdTokenslength) external {
        _mint(msg.sender, _allIdTokenslength);// переводим ему nft токен
    }
 

}   