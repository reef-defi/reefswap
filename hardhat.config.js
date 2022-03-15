require("@reef-defi/hardhat-reef");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          outputSelection: {
            "*": {
              "*": ["metadata", "evm.bytecode", "evm.bytecode.sourceMap"],
              "": ["ast"],
            },
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          outputSelection: {
            "*": {
              "*": ["metadata", "evm.bytecode", "evm.bytecode.sourceMap"],
              "": ["ast"],
            },
          },
        },
      },
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 999999,
          },
          outputSelection: {
            "*": {
              "*": ["metadata", "evm.bytecode", "evm.bytecode.sourceMap"],
              "": ["ast"],
            },
          },
        },
      },
    ],
  },
  defaultNetwork: "reef",
  networks: {
    reef: {
      url: "ws://127.0.0.1:9944",
      scanUrl: "http://localhost:8000",
      seeds: {
        account: "<MNEMONIC>"
      }
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      scanUrl: "https://testnet.reefscan.com", // Localhost verification testing: http://localhost:3000
      seeds: {
        account: "<MNEMONIC>",
      },
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      gasLimit: 6000000000,
    },
  },
};
