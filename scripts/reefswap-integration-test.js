const hre = require("hardhat");
const ethers = require("ethers");
const { addLiquidity, removeLiquidity, swap } = require("./utils");

const dollar = ethers.BigNumber.from("10000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";


const addresses = {
  token1: '0x0230135fDeD668a3F7894966b14F42E65Da322e4',
  token2: '0x546411ddd9722De71dA1B836327b37D840F16059',
  factory: '0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4',
  router: '0x818Be9d50d84CF31dB5cefc7e50e60Ceb73c1eb5'
}


async function main() {
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount();
  const signerAddress = await reefswapDeployer.getAddress();

  // token contracts
  const token1 = await hre.reef.getContractAt("LotrToken", addresses.token1, reefswapDeployer);
  const token2 = await hre.reef.getContractAt("SwToken", addresses.token2, reefswapDeployer);
  const reefToken = await hre.reef.getContractAt("Token", REEF_ADDRESS, reefswapDeployer);

  // const factory = await hre.reef.getContractAt("ReefswapV2Factory", addresses.factory, reefswapDeployer);
  const router = await hre.reef.getContractAt("ReefswapV2Router02", addresses.router, reefswapDeployer);
  
  const select = (num) => {
    switch(num % 3) {
      case 0: return reefToken;
      case 1: return token1;
      case 2: return token2;
    };
  }
  const pick = (num) => {
    const p = Math.floor(Math.random()*2)
    switch(num % 3) {
      case 0: return [token1, token2][p];
      case 1: return [token2, reefToken][p];
      case 2: return [reefToken, token1][p];
    };
  }
  // Create 10 random swaps
  for (let i = 0; i < 30; i++) {
    await swap(
      router,
      select(i),
      pick(i),
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
