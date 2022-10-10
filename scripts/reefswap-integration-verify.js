const hre = require("hardhat");
const ethers = require("ethers");
const { addLiquidity, removeLiquidity, swap } = require("./utils");


const addresses = {
  token1: '0x0230135fDeD668a3F7894966b14F42E65Da322e4',
  token2: '0x546411ddd9722De71dA1B836327b37D840F16059',
  factory: '0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4',
  router: '0x818Be9d50d84CF31dB5cefc7e50e60Ceb73c1eb5'
}

const dollar = ethers.BigNumber.from("10000000000000");

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  const signerAddress = await reefswapDeployer.getAddress();

  // deploy
  const defaultArgs = [dollar.mul(1000000000000000)];
  const factoryArgs = [signerAddress];
  const routerArgs = [addresses.factory, addresses.token1];

  // deploy
  // console.log('Token contract verification')
  await hre.reef.verifyContract(addresses.token1, "LotrToken", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
    license: "MIT",
  });
  await hre.reef.verifyContract(addresses.token2, "SwToken", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
    license: "MIT",
  });
  console.log("Verifing factory");
  await hre.reef.verifyContract(
    addresses.factory,
    "ReefswapV2Factory",
    factoryArgs,
    {
      compilerVersion: "v0.5.16+commit.9c3226ce",
      license: "MIT", 
    }
  );
  console.log("Verifing router");
  await hre.reef.verifyContract(
    addresses.router,
    "ReefswapV2Router02",
    routerArgs,
    { 
      compilerVersion: "v0.6.6+commit.6c089d02",
      license: "MIT", 
    }
  );

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
