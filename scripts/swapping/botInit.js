const hre = require("hardhat");
const ethers = require("ethers");
const { createToken, createFactory, createRouter, addLiquidity, removeLiquidity } = require("../utils");

const dollar = ethers.BigNumber.from("100000000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";

const tokens = {
  tokenErc1: '0x546411ddd9722De71dA1B836327b37D840F16059',
  tokenErc2: '0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4',
  // factory: '0x818Be9d50d84CF31dB5cefc7e50e60Ceb73c1eb5',
  // router: '0x485732AB70E7cD41323EdCCc57d048047D53F679'
  factory: "0xcA36bA38f2776184242d3652b17bA4A77842707e",
  router: "0x0A2906130B1EcBffbE1Edb63D5417002956dFd41",
}

async function main() {
  console.log('Initializing main acc')
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount()
  
  console.log('Initializing sub accs')
  const signers = await Promise.all(["bob", "dave", "charlie", "eve", "ferdie", "acc"]
    .map(name => hre.reef.getSignerByName(name))
  );

  await Promise.all(signers.map(signer => signer.claimDefaultAccount()))

  const evmAddress = await reefswapDeployer.getAddress();
  const addresses = await Promise.all(signers.map(signer => signer.getAddress()));

  console.log("Creating tokens")
  // reefswap contracts
  const token1 = await createToken("LotrToken", reefswapDeployer, dollar.mul(300000000000000000));
  const token2 = await createToken("SwToken", reefswapDeployer, dollar.mul(300000000000000000));
  // const factory = await createFactory(reefswapDeployer);
  // const router = await createRouter(reefswapDeployer, factory.address, REEF_ADDRESS);

  // console.log('Retrieving tokens');
  // const token1 = await hre.reef.getContractAt("Token", tokens.tokenErc1, reefswapDeployer);
  // const token2 = await hre.reef.getContractAt("Token", tokens.tokenErc2, reefswapDeployer);
  const factory = await hre.reef.getContractAt("ReefswapV2Factory", tokens.factory, reefswapDeployer);
  const router = await hre.reef.getContractAt("ReefswapV2Router02", tokens.router, reefswapDeployer);

  console.log({
    tokenErc1: token1.address,
    tokenErc2: token2.address,
    factory: factory.address,
    router: router.address,
  });

  for (const address of addresses) {
    console.log('Transfering to ', address)
    await token1.transfer(address, dollar.mul(3000000000000))
    await token2.transfer(address, dollar.mul(3000000000000))
  }
  console.log('Token transfers complete')

  await addLiquidity(
    router,
    token1,
    token2,
    dollar.mul(30000000000),
    dollar.mul(30000000000),
    evmAddress
  );

  await removeLiquidity(
    token1, 
    token2,
    factory,
    router,
    reefswapDeployer,
    dollar.mul(3000),
  )
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
