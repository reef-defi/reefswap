import { Contract, ContractFactory, BigNumber } from "ethers";

// Our contracts
//import UniswapFactory from "../artifacts/contracts/uniswap/UniswapV2Factory.sol/UniswapV2Factory.json";
import UniswapRouter from "../artifacts/contracts/uniswap-periphery/UniswapV2Router02.sol/UniswapV2Router02.json";
import Token from "../artifacts/contracts/Token.sol/Token.json";


// Precompiled contracts
//import { readFileSync } from 'fs';
import UniswapFactory from "../built_artifacts/UniswapV2Factory.json";
//import UniswapRouter from "../artifacts/examples/UniswapV2Router02.json";
//import Token from "../artifacts/examples/Token.json";
import IERC20 from "../built_artifacts/IERC20.json";
import setup from "./setup";


const dollar = BigNumber.from("10000000000000");

const main = async () => {
  const { wallet, provider } = await setup();
  const deployerAddress = await wallet.getAddress();

  const reefAddress = '0x0000000000000000000000000000000001000000';

  const tokenReef = new Contract(reefAddress, IERC20.abi, wallet);

  const tokenErc = await ContractFactory.fromSolidity(Token)
    .connect(wallet)
    .deploy(dollar.mul(1000));

  // deploy factory
  const factory = await ContractFactory.fromSolidity(UniswapFactory)
    .connect(wallet)
    .deploy(deployerAddress);

  // deploy router
  const router = await ContractFactory.fromSolidity(UniswapRouter)
    .connect(wallet)
    .deploy(factory.address, tokenReef.address);

  console.log("Deploy done");
  console.log({
    tokenReef: tokenReef.address,
    tokenErc: tokenErc.address,
    factory: factory.address,
    router: router.address,
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
