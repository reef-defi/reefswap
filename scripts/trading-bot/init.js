const hre = require("hardhat");
const ethers = require("ethers");
const { createToken, addLiquidity, removeLiquidity } = require("../utils");

const dollar = ethers.BigNumber.from("100000000000000000");

const tokens = {
  factory: "0xcA36bA38f2776184242d3652b17bA4A77842707e",
  router: "0x0A2906130B1EcBffbE1Edb63D5417002956dFd41",
}

async function main() {
  console.log('Initializing main acc')
  const reefswapDeployer = await hre.reef.getSignerByName("account");
  await reefswapDeployer.claimDefaultAccount()
  
  const evmAddress = await reefswapDeployer.getAddress();

  console.log("Creating tokens")
  const token1 = await createToken("LotrToken", reefswapDeployer, dollar.mul(ethers.BigNumber.from('300000000000000000')));
  
  const token2 = await createToken("SwToken", reefswapDeployer, dollar.mul(ethers.BigNumber.from('300000000000000000')));

  console.log('Retrieving tokens');
  const factory = await hre.reef.getContractAt("ReefswapV2Factory", tokens.factory, reefswapDeployer);
  const router = await hre.reef.getContractAt("ReefswapV2Router02", tokens.router, reefswapDeployer);

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
    dollar.mul(ethers.BigNumber.from('3000000000000000')),
    dollar.mul(ethers.BigNumber.from('3000000000000000')),
    evmAddress
  );
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
