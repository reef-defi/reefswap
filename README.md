# Reefswap

Reefswap is a DEX on the Reef chain.


## Existing deployment
Reefswap is already deployed on the following networks:


#### Reef Mainnet
```
factory: "0x380a9033500154872813F6E1120a81ed6c0760a8"
router: "0x641e34931C03751BFED14C4087bA395303bEd1A5"
```


#### Reef Testnet (Maldives):

```
factory: "0xcA36bA38f2776184242d3652b17bA4A77842707e"
router: "0x0A2906130B1EcBffbE1Edb63D5417002956dFd41"
```

## Installing

Install all dependencies with `yarn`.

Reefswap can be deployed in different ways:

- `scripts/` folder includes `hardhat` scripts
- `src/` folder includes raw TypeScript scripts, which directly use `evm-provider.js`

## Deploy
Run
`npx hardhat run scripts/deploy.js`

The script will create two ERC20 tokens, Reefswap Factory, Reefswap Router and add liquidity to them through the Reefswap router.


## Trade

Change the addresses in `src/trade.ts` to match the ones in the deploy scripts and then run:
`yarn trade`

## Random testing trading bot
Random bot was defined for the purouse of testing swap and pool data.
It consists of deploymant and swapping

How to run:
- In the first instance user needs to provide 10k Reef to default accounts
- `yarn hardhat run scripts/botInit.js` - Create tokens, facotry, router, verifie them, add liquidity and remove liquidity
- Replace token addresses in `scripts/bot.js` with given output from `botInit` - Default accounts are swapping randomly with random amounts
- `yarn hardhat run scripts/bot.js`


## Configure
Define your Reef chain URL in `hardhat.config.js` (by default `ws://127.0.0.1:9944`):

Hardhat-reef uses the default network `reef`.
If the user wants to run the script on the other network, he can do so in CLI with `--network {network-name}` flag.

To change the deployer account, update the line 
```
const reefswapDeployer = await hre.reef.getSignerByName("alice");
```

in `scripts/deploy.js` to your account defined in `hardhat.config.js`.

Example:
`yarn hardhat run scripts/sample-script.js --network hardhat`

Users can define the network configuration in `hardhat.config.js`.
He can switch the `defaultNetwork` to the desired one.

Configuring the Reef network, the user can edit its URL. If the URL exists (can be pinged), the system will automatically connect to it, else it will run internal `Reef-Node` and try to connect to it.
