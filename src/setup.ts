import {
  TestAccountSigningKey,
  Provider,
  Signer,
} from "@reef-defi/evm-provider";
import { WsProvider, Keyring } from "@polkadot/api";
import { createTestPairs } from "@polkadot/keyring/testingPairs";
import { KeyringPair } from "@polkadot/keyring/types";

const WS_URL = process.env.WS_URL || "ws://127.0.0.1:9944";
const seed = process.env.SEED;

const setup = async () => {
  const provider = new Provider({
    provider: new WsProvider(WS_URL),
  });

  await provider.api.isReady;

  let pair: KeyringPair;
  if (seed) {
    const keyring = new Keyring({ type: "sr25519" });
    pair = keyring.addFromUri(seed);
  } else {
    const testPairs = createTestPairs();
    pair = testPairs.alice;
  }

  const signingKey = new TestAccountSigningKey(provider.api.registry);
  signingKey.addKeyringPair(pair);

  const wallet = new Signer(provider, pair.address, signingKey);

  // Claim default account
  if (!(await wallet.isClaimed())) {
    console.log(
      "No claimed EVM account found -> claimed default EVM account: ",
      await wallet.getAddress()
    );
    await wallet.claimDefaultAccount();
  }

  return {
    wallet,
    provider,
  };
};

export default setup;
