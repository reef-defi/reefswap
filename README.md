# hardhat-reef-template

Hardhat-reef-template prepares the user all essentials to get started with the Reef-chain.

## Installing

Install dependencies with `yarn`.


## Running

`yarn hardhat run scripts/sample-script.js`


Define your Reef chain URL in `hardhat.config.js` (by default `ws://127.0.0.1:9944`):

```javascript
module.exports = {
	solidity: "0.7.3",
	defaultNetwork: "reef",
	networks: {
		reef: {
			url: "ws://127.0.0.1:9944",
		}
	},
};
```

See `scripts/` folder for example scripts, e.g. to deploy flipper run:

```
npx hardhat run scripts/flipper/deploy.js 
```

After the contract is deployed, you can interact with it using the `flip.js` script:

```
npx hardhat run scripts/flipper/flip.js 
```

make sure the `flipperAddress` corresponds to the deployed address.
