const hre = require("hardhat");
const ethers = require("ethers");
const { createToken, createFactory, createRouter, addLiquidity, removeLiquidity } = require("./utils");

const dollar = ethers.BigNumber.from("100000000000000");
const REEF_ADDRESS = "0x0000000000000000000000000000000001000000";


async function main() {
  console.log('Initializing main acc')
  const reefswapDeployer = await hre.reef.getSignerByName("alice");
  await reefswapDeployer.claimDefaultAccount()
  
  console.log('Initializing sub accs')
  const signers = await Promise.all(["dave", "bob", "charlie", "eve", "ferdie"]
    .map(name => hre.reef.getSignerByName(name))
  )

  await Promise.all(signers.map(signer => signer.claimDefaultAccount()))

  const evmAddress = await reefswapDeployer.getAddress();
  const addresses = await Promise.all(signers.map(signer => signer.getAddress()));

  console.log("Creating tokens")
  // reefswap contracts
  const token1 = await createToken(reefswapDeployer, dollar.mul(300000000000000));
  const token2 = await createToken(reefswapDeployer, dollar.mul(100000000000000));
  const factory = await createFactory(reefswapDeployer);
  const router = await createRouter(reefswapDeployer, factory.address, REEF_ADDRESS);
  
  console.log({
    tokenErc1: token1.address,
    tokenErc2: token2.address,
    factory: factory.address,
    router: router.address,
  });

  for (const address of addresses) {
    console.log('Transfering to ', address)
    await token1.transfer(address, dollar.mul(3000000000000))
    await token2.transfer(address, dollar.mul(1000000000000))
  }
  console.log('Token transfers complete')

  await addLiquidity(
    router,
    token1,
    token2,
    dollar.mul(3000000000000),
    dollar.mul(1000000000000),
    evmAddress
  );

  await removeLiquidity(
    token1, 
    token2,
    factory,
    router,
    reefswapDeployer,
    dollar.mul(1000),
    dollar.mul(990),
    dollar.mul(990),
  )
  console.log("Finished!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
