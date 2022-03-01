const hre = require("hardhat");
const ethers = require("ethers");

const dollar = ethers.BigNumber.from("100000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";

const tokens = {
  tokenReef: '0x709bD59aD352C2ee0b41e4920AE3b7e5F42EB222',    
  tokenErc1: '0x45F5eD44A3CD988B4f2cA71832B2de29D0930bc1',
  tokenErc2: '0xe1F624F629Df126a1b7aE30B47fD2E52902834cb',
  factory: '0x6a6f9922a9a680040365D5d2C3aa94dc95CfeCbb',
  router: '0xd5Bd58976fEE1914dE352d335E8d82761F96577d'
}

const createToken = async (signer, amount) => {
  const args = [amount];

  const Token = await hre.reef.getContractFactory(
    "Token",
    signer
  );

  const token = await Token.deploy(...args);
  await hre.reef.verifyContract(token.address, "Token", args, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
  });

  return token;
}

const createFactory = async (signer) => {
  console.log("deploying factory");
  const factoryArgs = [await signer.getAddress()];
  const ReefswapV2Factory = await hre.reef.getContractFactory(
    "ReefswapV2Factory",
    signer
  );
  const factory = await ReefswapV2Factory.deploy(...factoryArgs);
  console.log("Verifing factory");
  await hre.reef.verifyContract(
    factory.address,
    "ReefswapV2Factory",
    factoryArgs,
    { compilerVersion: "v0.5.16+commit.9c3226ce" }
  );
  return factory;
}

const createRouter = async (signer, factoryAddress, mainTokenAddress) => {
  console.log("deploying router");
  const routerArgs = [factoryAddress, mainTokenAddress];
  const ReefswapV2Router = await hre.reef.getContractFactory(
    "ReefswapV2Router02",
    signer
  );
  const router = await ReefswapV2Router.deploy(...routerArgs);
  console.log("Verifing router");
  await hre.reef.verifyContract(
    router.address,
    "ReefswapV2Router02",
    routerArgs,
    { compilerVersion: "v0.6.6+commit.6c089d02" }
  );
  return router;
}

const addLiquidity = async (router, token1, token2, amount1, amount2, mainAddress) => {
  await token1.approve(router.address, amount1);
  await token2.approve(router.address, amount2);

  console.log("Approve successful");

  await router.addLiquidity(
    token1.address,
    token2.address,
    amount1,
    amount2,
    0,
    0,
    mainAddress,
    10000000000
  );
  console.log("Liquidity added");
};

const swap = async (router, sell, buy, sellAmount, buyMinAmount, accEvmAddress) => {
  await sell.approve(router.address, sellAmount);
  console.log("Approve successful");

  await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
    sellAmount,
    buyMinAmount,
    [sell.address, buy.address],
    accEvmAddress,
    Date.now() + 60000 // One minute
  )
  console.log(`Swap success: ${sellAmount} -> ${buyMinAmount}`)
}

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  console.log("Claiming default account")
  // await reefswapDeployer.claimDefaultAccount()
  const evmAddress = await reefswapDeployer.getAddress();

  console.log("Creating tokens")
  // reefswap contracts
  const token1 = await createToken(reefswapDeployer, dollar.mul(100000000000000));
  const token2 = await createToken(reefswapDeployer, dollar.mul(100000000000000));
  const factory = await createFactory(reefswapDeployer);
  const router = await createRouter(reefswapDeployer, factory.address, REEF_ADDRESS);
  
  // console.log('Retrieving tokens');
  // const token1 = await hre.reef.getContractAt("Token", tokens.tokenErc1, reefswapDeployer);
  // const token2 = await hre.reef.getContractAt("Token", tokens.tokenErc2, reefswapDeployer);
  // const factory = await hre.reef.getContractAt("ReefswapV2Factory", tokens.factory, reefswapDeployer);
  // const router = await hre.reef.getContractAt("ReefswapV2Router02", tokens.router, reefswapDeployer);

  
  console.log({
    tokenErc1: token1.address,
    tokenErc2: token2.address,
    factory: factory.address,
    router: router.address,
  });
  
  await addLiquidity(
    router,
    token1,
    token2,
    dollar.mul(1000000000000),
    dollar.mul(1000000000000),
    evmAddress
  );

  const poolAddr = await factory.getPair(token1.address, token2.address);
  const pool = await hre.reef.getContractAt("ReefswapV2Pair", poolAddr, reefswapDeployer);
  
  console.log("Pool found")
  await pool.approve(router.address, dollar.mul(1000))
  console.log("Approced remove")

  await router.removeLiquidity(
    token1.address,
    token2.address,
    dollar.mul(1000),
    dollar.mul(990),
    dollar.mul(990),
    evmAddress,
    Date.now() + 60 * 1000,
  )
  console.log("Liquidity removed")

  console.log("Swaping token1")

  const defaultAmount = dollar.mul(10000000);
  let amount = defaultAmount;
  for (let index = 0; index < 10; index ++) {
    const min = amount.div(10);
    await swap(router, token1, token2, amount, min, evmAddress);
    amount = defaultAmount.mul(Math.floor(Math.random() * 9) + 1);
  }
  console.log("Swaping token2")
  for (let index = 0; index < 10; index ++) {
    const min = amount.div(10);
    await swap(router, token2, token1, amount, min, evmAddress);
    amount = defaultAmount.mul(Math.floor(Math.random() * 9) + 1);
  }

  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
