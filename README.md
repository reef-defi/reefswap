# Reefswap

Reefswap is a DEX on the Reef chain.

## Installing

Install all dependencies with `yarn`.

## Running
Write scripts under the `scripts` directory and run them using the following run template...
`npx hardhat run scripts/{script-name}.js`


## Configure
Define your Reef chain URL in `hardhat.config.js` (by default `ws://127.0.0.1:9944`):

Hardhat-reef uses the default network `reef`.
If the user wants to run the script on the other network, he can do so in CLI with `--network {network-name}` flag.

Example:
`yarn hardhat run scripts/sample-script.js --network hardhat`

Users can define the network configuration in `hardhat.config.js`.
He can switch the `defaultNetwork` to the desired one.

Configuring the Reef network, the user can edit its URL. If the URL exists (can be pinged), the system will automatically connect to it, else it will run internal `Reef-Node` and try to connect to it.

The default configuration has `reef` defined as the default network, and its URL is set to: `ws://127.0.0.1:9944`.
```javascript
module.exports = {
	solidity: "0.7.3",
};
```

Users can modify their values by replacing the existing ones like so...
```javascript
module.exports = {
	solidity: "0.7.3",

  networks: {
		reef: {
			url: "ws://127.0.0.1:9944",
		}
	},
};
```

Connect to the reef-testnet...
```javascript
module.exports = {
	solidity: "0.7.3",
	
  networks: {
		reef: {
			url: "wss://rpc-testnet.reefscan.com/ws",
		}
	},
};
```
