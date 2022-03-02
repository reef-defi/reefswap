const { RandomSwapBot } = require("../swapBot")

const tokens = {
  tokenErc1: '0x76Ac256ccea317379514437Cf1212DB653dcaf10',
  tokenErc2: '0x550828Ee09E7FA20e8f723611206e3825cfaF7Ac',
  factory: '0x3D60297D8177fA99c662771225aCaE37F960c3b2',
  router: '0x279Ca69162660cc10E5B201A3A9bC26a543A729b'
}

async function main() {
  const ramdomSwapBots = ["alice", "dave", "bob", "charlie", "eve", "ferdie"]
    .map((name) => new RandomSwapBot(name));

  await Promise.all(ramdomSwapBots.map(swapper => swapper.initialize(tokens)));

  while (true) {
    await Promise.all(
      ramdomSwapBots.map(swapper => swapper.swap())
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
