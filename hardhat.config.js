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
            runs: 1000,
          },
          outputSelection: {
            "*": {
              "*": [
                "metadata",
                "evm.bytecode", // Enable the metadata and bytecode outputs of every single contract.
                "evm.bytecode.sourceMap", // Enable the source map output of every single contract.
              ],
              "": [
                "ast", // Enable the AST output of every single file.
              ],
            },
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          outputSelection: {
            "*": {
              "*": [
                "metadata",
                "evm.bytecode", // Enable the metadata and bytecode outputs of every single contract.
                "evm.bytecode.sourceMap", // Enable the source map output of every single contract.
              ],
              "": [
                "ast", // Enable the AST output of every single file.
              ],
            },
          },
        },
      },
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          outputSelection: {
            "*": {
              "*": [
                "metadata",
                "evm.bytecode", // Enable the metadata and bytecode outputs of every single contract.
                "evm.bytecode.sourceMap", // Enable the source map output of every single contract.
              ],
              "": [
                "ast", // Enable the AST output of every single file.
              ],
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
    },
  },
};
