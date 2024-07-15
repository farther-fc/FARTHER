import { contractAddresses } from "@farther/common";
import { createPublicClient, http } from "viem";
import { optimism } from "viem/chains";

export const optimsimClient = createPublicClient({
  chain: optimism,
  transport: http(
    "https://opt-mainnet.g.alchemy.com/v2/9uvLmscGqNJCNJpJRHPhaWijUp_nWnx0",
  ),
});

export async function wasFidRegisteredInPastMonth(fid: number) {
  const currentBlockTime = await optimsimClient.getBlockNumber();

  const logs = await optimsimClient.getLogs({
    address: contractAddresses.FARCASTER_ID_REGISTRY,
    // Looks back approximately 1 month (assuming 2 sec block time)
    fromBlock: currentBlockTime - BigInt(1_209_600),
    event: {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "address", name: "to", type: "address" },
        { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        {
          indexed: false,
          internalType: "address",
          name: "recovery",
          type: "address",
        },
      ],
      name: "Register",
      type: "event",
    },
    args: { id: BigInt(fid) },
  });

  return logs.length > 0;
}

wasFidRegisteredInPastMonth(4378).then(console.log);
