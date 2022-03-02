const hre = require("hardhat");
const ethers = require("ethers");
const { swap } = require("./utils");

const dollar = ethers.BigNumber.from("100000000000000");

const defaultAmount = dollar.mul(100);



class RandomSwapBot {
  name;
  router;
  signer;
  address;
  token1;
  token2;

  constructor(name) {
    this.name = name;
  }

  async initialize(tokens) {
    this.signer = await hre.reef.getSignerByName(this.name);
    this.address = await this.signer.getAddress();
    this.token1 = await hre.reef.getContractAt("Token", tokens.tokenErc1, this.signer);
    this.token2 = await hre.reef.getContractAt("Token", tokens.tokenErc2, this.signer);
    this.router = await hre.reef.getContractAt("ReefswapV2Router02", tokens.router, this.signer); 
  }

  async swap() {
    const multiplier = Math.random() * 10 ** Math.round(Math.random() * 6 + 3)
    const amount = defaultAmount.mul(Math.round(multiplier));
    const min = amount.div(10);
    const pick = Math.random() < 0.5
    const [token1, token2] = pick
      ? [this.token1, this.token2] 
      : [this.token2, this.token1] 

    console.log(`${this.name} is swapping...`);
    await swap(this.router, token1, token2, amount, min, this.address);
  }
}

module.exports = {
  RandomSwapBot
};