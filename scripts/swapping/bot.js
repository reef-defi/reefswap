const { BasicBot } = require("../bots/basicBot")

const tokens = {
  tokenErc1: '0x0230135fDeD668a3F7894966b14F42E65Da322e4',
  tokenErc2: '0x546411ddd9722De71dA1B836327b37D840F16059',
  factory: '0xD3ba2aA7dfD7d6657D5947f3870A636c7351EfE4',
  router: '0x818Be9d50d84CF31dB5cefc7e50e60Ceb73c1eb5'
}


async function main() {
  const ramdomSwapBots = ["alice", "dave", "bob", "charlie", "eve", "ferdie", "acc"]
    .map((name) => new BasicBot(name));

  await Promise.all(ramdomSwapBots.map(swapper => swapper.initialize(tokens)));

  while (true) {
    await Promise.all(
      ramdomSwapBots.map(swapper => swapper.step())
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
