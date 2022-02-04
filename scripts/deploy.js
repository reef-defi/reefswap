const hre = require("hardhat");
const ethers = require("ethers");

const dollar = ethers.BigNumber.from("10000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount();
  const signerAddress = await reefswapDeployer.getAddress();

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
  console.log("deploying reef");
  const defaultArgs = [dollar.mul(1000)];
  const tokenReef = await ReefToken.deploy(...defaultArgs);
  await hre.reef.verifyContract(tokenReef.address, "Token", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
  });
  console.log("deploying erc");
  const tokenErc = await ErcToken.deploy(...defaultArgs);
  await hre.reef.verifyContract(tokenErc.address, "Token", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
  });

  console.log("deploying factory");
  const factoryArgs = [signerAddress];
  const factory = await ReefswapV2Factory.deploy(...factoryArgs);
  console.log("Verifing factory");
  await hre.reef.verifyContract(
    factory.address,
    "ReefswapV2Factory",
    factoryArgs,
    { compilerVersion: "v0.5.16+commit.9c3226ce" }
  );

  console.log("deploying router");
  const routerArgs = [factory.address, tokenReef.address];
  const router = await ReefswapV2Router.deploy(...routerArgs);
  console.log("Verifing router");
  await hre.reef.verifyContract(
    router.address,
    "ReefswapV2Router02",
    routerArgs,
    { compilerVersion: "v0.6.6+commit.6c089d02" }
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
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
