const hre = require("hardhat");
const ethers = require("ethers");

const dollar = ethers.BigNumber.from("10000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount();

  // token contracts
  const ReefToken = await hre.reef.getContractFactory(
    "Token",
    reefswapDeployer
  );
  const ErcToken = await hre.reef.getContractFactory("Token", reefswapDeployer);

  // reefswap contracts
  const ReefswapV2Factory = await hre.reef.getContractFactory(
    "ReefswapV2Factory",
    reefswapDeployer
  );
  const ReefswapV2Router = await hre.reef.getContractFactory(
    "ReefswapV2Router02",
    reefswapDeployer
  );

  // deploy
  const tokenReef = await ReefToken.deploy(dollar.mul(1000));
  const tokenErc = await ErcToken.deploy(dollar.mul(1000));

  const factory = await ReefswapV2Factory.deploy(
    await reefswapDeployer.getAddress()
  );

  const router = await ReefswapV2Router.deploy(
    factory.address,
    tokenReef.address
  );

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

  const address = await reefswapDeployer.getAddress();

  const tx = await router.addLiquidity(
    tokenReef.address,
    tokenErc.address,
    dollar.mul(2),
    dollar,
    0,
    0,
    address,
    10000000000
  );

  // check
  const tradingPairAddress = await factory.getPair(
    tokenReef.address,
    tokenErc.address
  );

  const tradingPair = await hre.reef.getContractAt(
    "Token",
    tradingPairAddress,
    reefswapDeployer
  );
  const lpTokenAmount = await tradingPair.balanceOf(address);
  const reefAmount = await tokenReef.balanceOf(tradingPairAddress);
  const ercAmount = await tokenErc.balanceOf(tradingPairAddress);

  console.log({
    tradingPair: tradingPairAddress,
    lpTokenAmount: lpTokenAmount.toString(),
    liquidityPoolReefAmount: reefAmount.toString(),
    liquidityPoolErcAmount: ercAmount.toString(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
