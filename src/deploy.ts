import { Contract, ContractFactory, BigNumber } from "ethers";

// Our contracts
import ReefswapFactory from "../artifacts/contracts/ReefswapV2Factory.sol/ReefswapV2Factory.json";
import ReefswapRouter from "../artifacts/contracts/ReefswapV2Router02.sol/ReefswapV2Router02.json";
import Token from "../artifacts/contracts/Token.sol/Token.json";

import setup from "./setup";

const dollar = BigNumber.from("10000000000000");

const main = async () => {
  const { wallet, provider } = await setup();
  const deployerAddress = await wallet.getAddress();

  const tokenReef = await ContractFactory.fromSolidity(Token)
    .connect(wallet)
    .deploy(dollar.mul(1000));

  const tokenErc = await ContractFactory.fromSolidity(Token)
    .connect(wallet)
    .deploy(dollar.mul(1000));

  // deploy factory
  const factory = await ContractFactory.fromSolidity(ReefswapFactory)
    .connect(wallet)
    .deploy(deployerAddress);

  // deploy router
  const router = await ContractFactory.fromSolidity(ReefswapRouter)
    .connect(wallet)
    .deploy(factory.address, tokenReef.address);

  console.log("Deploy done");
  console.log({
    tokenReef: tokenReef.address,
    tokenErc: tokenErc.address,
    factory: factory.address,
    router: router.address,
    deployerAddress: deployerAddress,
  });

  // approve
  await tokenReef.approve(router.address, dollar.mul(100));
  await tokenErc.approve(router.address, dollar.mul(100));

  console.log("Approve successful");
  // add liquidity
  await router.addLiquidity(
    tokenReef.address,
    tokenErc.address,
    dollar.mul(2),
    dollar,
    0,
    0,
    deployerAddress,
    10000000000
  );

  console.log("AddLiquidity successful");
  // check
  const tradingPairAddress = await factory.getPair(
    tokenReef.address,
    tokenErc.address
  );
  const tradingPair = new Contract(tradingPairAddress, Token.abi, wallet);
  const lpTokenAmount = await tradingPair.balanceOf(deployerAddress);
  const reefAmount = await tokenReef.balanceOf(tradingPairAddress);
  const ercAmount = await tokenErc.balanceOf(tradingPairAddress);

  console.log({
    tradingPair: tradingPairAddress,
    lpTokenAmount: lpTokenAmount.toString(),
    liquidityPoolReefAmount: reefAmount.toString(),
    liquidityPoolErcAmount: ercAmount.toString(),
  });

  provider.api.disconnect();
};

main();
