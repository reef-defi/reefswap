const hre = require("hardhat");
const ethers = require("ethers");
const { swap, addLiquidity, removeLiquidity } = require("../utils");

const dollar = ethers.BigNumber.from("100000000000000000");

class BasicBot {
  name;
  router;
  signer;
  address;
  token1;
  token2;

  constructor(name) {
    this.name = name;
  }

  getRandomAmount() {
    const pow = Math.max(Math.round(Math.random() * 3), 1) + 1;
    const multiplier = Math.random() * 10 ** pow;
    return dollar.mul(Math.round(multiplier)).add(dollar);
  }

  getTokenPick() {
    const pick = Math.random() <= 0.5
    
    const [token1, token2] = pick
      ? [this.token1, this.token2]
      : [this.token2, this.token1];

    return [pick, token1, token2];
  }

  async initialize(tokens) {
    this.signer = await hre.reef.getSignerByName(this.name);
    this.address = await this.signer.getAddress();
    this.token1 = await hre.reef.getContractAt("LotrToken", tokens.lotrtoken, this.signer);
    this.token2 = await hre.reef.getContractAt("SwToken", tokens.swtoken, this.signer);
    this.router = await hre.reef.getContractAt("ReefswapV2Router02", tokens.router, this.signer); 
    this.factory = await hre.reef.getContractAt("ReefswapV2Factory", tokens.factory, this.signer);
  }

  async swap() {
    const [pick, token1, token2] = this.getTokenPick();
    const amount = this.getRandomAmount();
    
    console.log(`${this.name} is swapping token ${pick ? '1' : '2'}...`);
    await swap(this.router, token1, token2, amount, 0, this.address);
  }

  async addLiquidity() {
    const [pick, token1, token2] = this.getTokenPick();
    const amount = this.getRandomAmount();

    console.log(`${this.name} is adding Liquidity ${pick ? '1' : '2'}...`);
    await addLiquidity(
      this.router,
      token1,
      token2,
      amount,
      amount,
      this.address
    )
  }

  async removeLiquidity() {
    const [pick, token1, token2] = this.getTokenPick();
    const amount = this.getRandomAmount();

    console.log(`${this.name} is removing Liquidity ${pick ? '1' : '2'}...`);
    await removeLiquidity(
      token1, 
      token2, 
      this.factory,
      this.router, 
      this.signer,
      amount
    );
  }

  async step() {
    const randomPick = Math.floor(Math.random() * 2);
    switch(randomPick) {
      case 0: return this.addLiquidity();
      case 1: return this.removeLiquidity();
    }
  }
}

module.exports = {
  BasicBot
};