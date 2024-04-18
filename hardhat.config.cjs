require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  paths: {
    artifacts: './src/artifacts',
    cache: './src/artifacts/cache',
    
  },
  networks: {
    hardhat: {
      chainId: 777,
    },
  },
  
};
