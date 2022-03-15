const { BasicBot } = require("../bots/basicBot")

const tokens = {
  lotrtoken: '0xD2461F4a18e2cf778D6906CeEE3a2B18029d38A3',
  swtoken: '0xfC1ac628485f10c2BA50c5B18eD761cEeBcc79dE',
  factory: '0xcA36bA38f2776184242d3652b17bA4A77842707e',
  router: '0x0A2906130B1EcBffbE1Edb63D5417002956dFd41',
}

const MINUTE_INTERVAL = process.env.MINUTE_INTERVAL || 10

async function main() {
  const bot = new BasicBot("testnet_account");
  console.log("Initializing bot...")
  await bot.initialize(tokens);
  console.log("Bot initialized!")
  
  setInterval(async () => {
    await bot.step();
  }, 1000 * 60 * MINUTE_INTERVAL);
}

main();
