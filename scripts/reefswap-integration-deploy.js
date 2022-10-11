const hre = require("hardhat");
const ethers = require("ethers");
const { addLiquidity, removeLiquidity, swap } = require("./utils");

const dollar = ethers.BigNumber.from("1000000000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount();
  const signerAddress = await reefswapDeployer.getAddress();

  // token contracts
  const LotrToken = await hre.reef.getContractFactory("LotrToken", reefswapDeployer);
  const SwToken = await hre.reef.getContractFactory("SwToken", reefswapDeployer);
  const reefToken = await hre.reef.getContractAt("Token", REEF_ADDRESS, reefswapDeployer);

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
  console.log("deploying token1");
  const defaultArgs = [dollar.mul("100000000000000000000000")];
  const token1 = await LotrToken.deploy(...defaultArgs);
  console.log(token1.address)
  console.log("deploying token2");
  const token2 = await SwToken.deploy(...defaultArgs);
  

  console.log("deploying factory");
  const factoryArgs = [signerAddress];
  const factory = await ReefswapV2Factory.deploy(...factoryArgs);
  console.log("deploying router");
  const routerArgs = [factory.address, token1.address];
  const router = await ReefswapV2Router.deploy(...routerArgs);


  // console.log('Token contract verification')
  await hre.reef.verifyContract(token1.address, "LotrToken", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
    license: "MIT",
  });
  await hre.reef.verifyContract(token2.address, "SwToken", defaultArgs, {
    compilerVersion: "v0.7.3+commit.9bfce1f6",
    license: "MIT",
  });
  console.log("Verifing factory");
  await hre.reef.verifyContract(
    factory.address,
    "ReefswapV2Factory",
    factoryArgs,
    {
      compilerVersion: "v0.5.16+commit.9c3226ce",
      license: "MIT", 
    }
  );
  console.log("Verifing router");
  await hre.reef.verifyContract(
    router.address,
    "ReefswapV2Router02",
    routerArgs,
    { 
      compilerVersion: "v0.6.6+commit.6c089d02",
      license: "MIT", 
    }
  );

  console.log("Deploy done");
  console.log({
    token1: token1.address,
    token2: token2.address,
    factory: factory.address,
    router: router.address,
  });

  console.log("Adding liquidity token1-token2");
  // Creating token2 - token1 pool pair
  await addLiquidity(
    router,
    token1,
    token2,
    dollar.mul("1000000"),
    dollar.mul("1000000"),
    signerAddress
  );
  
  // Creating REEF - token1 pool pair
  console.log("Adding liquidity Reef-token1");
  await addLiquidity(
    router,
    reefToken,
    token1,
    dollar.mul("1000000").toString(),
    dollar.mul("1000000").div(2).toString(),
    signerAddress
  );
  // Creating REEF - token2 pool pair
  console.log("Adding liquidity Reef-token2");
  await addLiquidity(
    router,
    reefToken,
    token2,
    dollar.mul("1000000").div(2).toString(),
    dollar.mul("1000000").toString(),
    signerAddress
  );
  // Withdraw from Reef - token2 pool pair
  console.log("Removing liquidity Reef-token2");
  await removeLiquidity(
    reefToken,
    token2,
    factory,
    router,
    reefswapDeployer,
    dollar.mul(100).toString()
  );

  const select = (num) => {
    switch(num % 3) {
      case 0: return reefToken;
      case 1: return token1;
      case 2: return token2;
    };
  }

  // Create 10 random swaps
  for (let i = 0; i < 1; i++) {
    await swap(
      router,
      select(i),
      select(i + 1),
      dollar.mul(100).toString(),
      dollar.mul(1).toString(),
      signerAddress
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
