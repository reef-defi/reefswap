const hre = require("hardhat");
const ethers = require("ethers");

const dollar = ethers.BigNumber.from("10000000000000");

async function main() {
  //var log = console.log;
  //console.log = function () {
  //log.apply(console, arguments);
  //// Print the stack trace
  //console.trace();
  //};
  const uniswapDeployer = await hre.reef.getSignerByName("alice");

  // token contracts
  const ReefToken = await hre.reef.getContractFactory("Token", uniswapDeployer);
  const ErcToken = await hre.reef.getContractFactory("Token", uniswapDeployer);

  // uniswap contracts
  const UniswapV2Factory = await hre.reef.getContractFactory(
    "UniswapV2Factory",
    uniswapDeployer
  );
  const UniswapV2Router = await hre.reef.getContractFactory(
    "UniswapV2Router02",
    uniswapDeployer
  );

  // deploy
  const tokenReef = await ReefToken.deploy(dollar.mul(1000));
  const tokenErc = await ErcToken.deploy(dollar.mul(1000));

  const factory = await UniswapV2Factory.deploy(
    await uniswapDeployer.getAddress()
  );

  const router = await UniswapV2Router.deploy(
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

  const address = await uniswapDeployer.getAddress();
  console.log("address", address);

  await router.addLiquidity(
    tokenReef.address,
    tokenErc.address,
    dollar.mul(2),
    dollar,
    0,
    0,
    address,
    10000000000
  );

  console.log("tx", tx);

  const tradingPairAddress = await factory.getPair(
    tokenReef.address,
    tokenErc.address
  );
  console.log({
    tradingPairAddress: tradingPairAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
