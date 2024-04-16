const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const NameCoin = await ethers.getContractFactory('NameCoin');
    const nameCoin = await NameCoin.deploy();
    console.log(`NameCoin Deployed to ${nameCoin.target}`)
    fs.writeFileSync('NCAddress.json', JSON.stringify(nameCoin.target));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});