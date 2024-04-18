const { ethers } = require("hardhat");
const { names } = require("./constructor.json");
const fs = require('fs');

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const NameCoin = await ethers.getContractFactory('NameCoin');
    const nameCoin = await NameCoin.deploy();
    console.log(`NameCoin Deployed to ${nameCoin.target}`)

    const NameNft = await ethers.getContractFactory('NameNft');
    const nameNft = await NameNft.deploy();
    console.log(`NameNft Deployed to ${nameNft.target}`);

    const NameWorld = await ethers.getContractFactory('NameWorld');
    const nameWorld = await NameWorld.deploy(nameCoin.target, nameNft.target); // deploy main contract use interfaces
    console.log(`NameWorld (main) deployed to ${nameWorld.target}`);
    // add names in constructor
    for(let i = 0; i < names.length; i++) {
      await nameWorld.connect(deployer).mintNNFT(names[i].name);
      console.log(`Name added: ${names[i].name}`);
    }
    fs.writeFileSync('contractAddress.json', JSON.stringify(nameCoin.target));

}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});