const hre = require("hardhat");
const ethers = require("ethers");
const { addLiquidity, removeLiquidity, swap } = require("./utils");

const dollar = ethers.BigNumber.from("10000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";


const addresses = {
  token1: '0x027604Ae23e07e6f1922f097e15F7E192B7F6683',
  token2: '0x1CFcc5aa841ab555cd6a673Ccc4402137c282Cf9',
  factory: '0x5bb368f1fc4f3373433CE5f73607CB084515294a',
  router: '0x60698cBf78299D3ebB56CB50363081cDE8Cc9bEb'
}

async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount();
  const signerAddress = await reefswapDeployer.getAddress();

  // token contracts
  const token1 = await hre.reef.getContractAt("Token", addresses.token1, reefswapDeployer);
  const token2 = await hre.reef.getContractAt("Token", addresses.token2, reefswapDeployer);
  const reefToken = await hre.reef.getContractAt("Token", REEF_ADDRESS, reefswapDeployer);

  const factory = await hre.reef.getContractAt("ReefswapV2Factory", addresses.factory, reefswapDeployer);
  const router = await hre.reef.getContractAt("ReefswapV2Router02", addresses.router, reefswapDeployer);

  // console.log("Adding liquidity token1-token2");
  // // Creating token2 - token1 pool pair
  // await addLiquidity(
  //   router,
  //   reefToken,
  //   token1,
  //   dollar.mul(1000000000),
  //   dollar.mul(1000000000),
  //   signerAddress
  // );


  // const t1t2PairAddress = await factory.getPair(token1.address, reefToken.address);
  // console.log('Pair address: ', t1t2PairAddress)
  // const reeftoken1PairAddress = await factory.getPair(reefToken.address, token1.address);
  // console.log('Pair address: ', reeftoken1PairAddress)
  // const reeftoken2PairAddress = await factory.getPair(reefToken.address, token2.address);
  // console.log('Pair address: ', reeftoken2PairAddress)


  // await hre.reef.verifyContract(
  //   t1t2PairAddress,
  //   "ReefswapV2Pair",
  //   [],
  //   { compilerVersion: "v0.5.16+commit.9c3226ce" }
  // );
  // console.log("Done");
  // return;
  // await hre.reef.verifyContract(
  //   reeftoken1PairAddress,
  //   "ReefswapV2Pair",
  //   [],
  //   { compilerVersion: "v0.5.16+commit.9c3226ce" }
  // );
  // await hre.reef.verifyContract(
  //   reeftoken2PairAddress,
  //   "ReefswapV2Pair",
  //   [],
  //   { compilerVersion: "v0.5.16+commit.9c3226ce" }
  // );
  
  // console.log("Adding liquidity token1-token2");
  // Creating token2 - token1 pool pair
  // await addLiquidity(
  //   router,
  //   token1,
  //   token2,
  //   dollar.mul(1000000000),
  //   dollar.mul(1000000000),
  //   signerAddress
  // );
  
  
  // // Creating REEF - token1 pool pair
  // console.log("Adding liquidity Reef-token1");
  // await addLiquidity(
  //   router,
  //   reefToken,
  //   token1,
  //   dollar.mul(1000000000).toString(),
  //   dollar.mul(1000000000/2).toString(),
  //   signerAddress
  // );
  // // Creating REEF - token2 pool pair
  // console.log("Adding liquidity Reef-token2");
  // await addLiquidity(
  //   router,
  //   reefToken,
  //   token2,
  //   dollar.mul(1000000000/2).toString(),
  //   dollar.mul(1000000000).toString(),
  //   signerAddress
  // );
  // // Withdraw from Reef - token2 pool pair
  // console.log("Removing liquidity Reef-token2");
  // await removeLiquidity(
  //   reefToken,
  //   token2,
  //   factory,
  //   router,
  //   reefswapDeployer,
  //   dollar.mul(100).toString()
  // );


  
  const select = (num) => {
    switch(num % 3) {
      case 0: return reefToken;
      case 1: return token1;
      case 2: return token2;
    };
  }

  // Create 10 random swaps
  for (let i = 0; i < 3; i++) {
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
