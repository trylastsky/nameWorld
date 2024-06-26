// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NameNft is ERC721 {


    constructor() ERC721("NameNFT", "NNFT")  {
    }

    function mint(address to, uint _allIdTokenslength) external {
        _mint(to, _allIdTokenslength);
    }

    function transfer(address _from,address _to, uint _tokenId) external {
        _transfer(_from, _to, _tokenId);
    }
 

}   