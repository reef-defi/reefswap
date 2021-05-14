import { Contract, BigNumber } from "ethers";
import ReefswapFactory from "../artifacts/contracts/ReefswapV2Factory.sol/ReefswapV2Factory.json";
import ReefswapRouter from "../artifacts/contracts/ReefswapV2Router02.sol/ReefswapV2Router02.json";
import Token from "../artifacts/contracts/Token.sol/Token.json";

import setup from "./setup";

const dollar = BigNumber.from("1000000000000");

const main = async () => {
  const reefAddress = "";
  const dic = {
    tokenReef: "0x0230135fDeD668a3F7894966b14F42E65Da322e4",
    tokenErc: "0x546411ddd9722De71dA1B836327b37D840F16059",
    factory: "0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4",
    router: "0x818Be9d50d84CF31dB5cefc7e50e60Ceb73c1eb5",
  };

  console.log(dic);
  const { wallet, provider } = await setup();
  const deployerAddress = await wallet.getAddress();
  const tokenReef = new Contract(dic.tokenReef, Token.abi, wallet);
  const tokenErc = new Contract(dic.tokenErc, Token.abi, wallet);

  const router = new Contract(dic.router, ReefswapRouter.abi, wallet);
  const factory = new Contract(
    await router.factory(),
    ReefswapFactory.abi,
    wallet
  );

  // approve
  await tokenReef.approve(router.address, dollar.mul(100));
  await tokenErc.approve(router.address, dollar.mul(100));

  // before
  const reefAmountBefore = await tokenReef.balanceOf(deployerAddress);
  const ercAmountBefore = await tokenErc.balanceOf(deployerAddress);

  console.log({
    reefAmountBefore: reefAmountBefore.toString(),
    ercAmountBefore: ercAmountBefore.toString(),
  });

  // trade

  const path = [dic.tokenErc, dic.tokenReef];
  const buyAmount = dollar;

  console.log("Trade", {
    path,
    buyAmount: buyAmount.toString(),
  });

  await router.swapExactTokensForTokens(
    buyAmount,
    0,
    path,
    deployerAddress,
    10000000000
  );

  // check
  const tradingPairAddress = await factory.getPair(dic.tokenReef, dic.tokenErc);
  const tradingPair = new Contract(tradingPairAddress, Token.abi, wallet);
  const lpTokenAmount = await tradingPair.balanceOf(deployerAddress);
  const lpReefAmount = await tokenReef.balanceOf(tradingPairAddress);
  const lpErcAmount = await tokenErc.balanceOf(tradingPairAddress);
  const reefAmountAfter = await tokenReef.balanceOf(deployerAddress);
  const ercAmountAfter = await tokenErc.balanceOf(deployerAddress);

  console.log({
    tradingPair: tradingPairAddress,
    lpTokenAmount: lpTokenAmount.toString(),
    liquidityPoolAcaAmount: lpReefAmount.toString(),
    liquidityPoolDotAmount: lpErcAmount.toString(),
    reefAmountAfter: reefAmountAfter.toString(),
    ercAmountAfter: ercAmountAfter.toString(),
  });

  provider.api.disconnect();
};

main();
