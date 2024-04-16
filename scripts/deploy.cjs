const { ethers } = require("hardhat");
const { names } = require("./constructor.json");
const fs = require('fs');

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const NameCoin = await ethers.getContractFactory('NameCoin');
    const nameCoin = await NameCoin.deploy();
    console.log(`NameCoin Deployed to ${nameCoin.target}`)
    const NameWorld = await ethers.getContractFactory('NameWorld');
    const nameWorld = await NameWorld.deploy();
    console.log(`NameWorld Deployed to ${nameWorld.target}`);
    fs.writeFileSync('NCAddress.json', JSON.stringify(nameCoin.target));
    fs.writeFileSync('NameWorldAddress.json', JSON.stringify(nameWorld.target));
    //add names for constructor
    for(let i = 0; i < names.length; i++) {
      await nameWorld.connect(deployer).mintToken(names[i].name);
      console.log(`Name added: ${names[i].name}`);
    }
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});