require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const rpc = process.env.rpcurl;

const pk = process.env.privatekey;

const key = process.env.escankey;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.8",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  networks: {
    goerli: {
      url: rpc,
      accounts: [pk],
      chainId: 5,
      blockConformations: 4
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: key,
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
};

