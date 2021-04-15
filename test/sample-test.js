const { assert } = require("chai");

describe("Flipper", function() {
  it("Should return the new flipped value once changed", async function() {
    const Flipper = await hre.reef.getContractFactory("Flipper");
    const flipper = await Flipper.deploy(true);

    assert.equal(await flipper.get(), true);
    await flipper.flip();
    assert.equal(await flipper.get(), false);
  });
});
