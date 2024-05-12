// Look at all Transfer events from FARTHER_OWNER_ADDRESS to each pool

import { FARTHER_OWNER_ADDRESS, contractAddresses } from "@farther/common";
import { ERC20__factory } from "@farther/common/src/typechain";
import { viemPublicClient } from "@farther/common/src/viem";

const START_BLOCK = 13832035;
const FARTHER_03PERCENT_POOL = "0x306e600e33A9c86B91EeA5A14c8C73F8de62AC84";
const FARTHER_1PERCENT_POOL = "0xeB00349d28B2B3F7fc7d0182d1433fe5B4cB3425";

// Subtract all transfer events from the pools back to FARTHER_OWNER_ADDRESS
// Example tx: https://basescan.org/tx/0xceb617af41a0c7deacd6bb4d127f94395c9f52d4a32f3c09e1d041240eddb8c2#eventlog

async function main() {
  const transferTo03PoolEvents = await viemPublicClient.getContractEvents({
    abi: ERC20__factory.abi,
    address: contractAddresses.FARTHER,
    eventName: "Transfer",
    args: {
      from: FARTHER_OWNER_ADDRESS,
      to: FARTHER_03PERCENT_POOL,
    },
    fromBlock: BigInt(START_BLOCK),
  });

  const transferTo03PoolTotal = transferTo03PoolEvents.reduce((acc, cur) => {
    if (!cur.args.value) throw Error("No value in transfer event");
    return acc + cur.args.value;
  }, BigInt(0));

  const transferTo1PoolEvents = await viemPublicClient.getContractEvents({
    abi: ERC20__factory.abi,
    address: contractAddresses.FARTHER,
    eventName: "Transfer",
    args: {
      from: FARTHER_OWNER_ADDRESS,
      to: FARTHER_1PERCENT_POOL,
    },
    fromBlock: BigInt(START_BLOCK),
  });

  const transferTo1PoolTotal = transferTo1PoolEvents.reduce((acc, cur) => {
    if (!cur.args.value) throw Error("No value in transfer event");
    return acc + cur.args.value;
  }, BigInt(0));

  const transferFromNftManagerEvents = await viemPublicClient.getContractEvents(
    {
      abi: ERC20__factory.abi,
      address: contractAddresses.FARTHER,
      eventName: "Transfer",
      args: {
        from: contractAddresses.NFT_POSITION_MANAGER,
        to: FARTHER_OWNER_ADDRESS,
      },
      fromBlock: BigInt(START_BLOCK),
    },
  );

  console.log({
    transferTo03PoolEvents: transferTo03PoolEvents.length,
    transferTo1PoolEvents: transferTo1PoolEvents.length,
    transferFromNftManagerEvents: transferFromNftManagerEvents.length,
  });

  const transfersOutTotal = transferFromNftManagerEvents.reduce((acc, cur) => {
    if (!cur.args.value) throw Error("No value in transfer event");
    return acc + cur.args.value;
  }, BigInt(0));

  const cumulativeLiquidity =
    transferTo03PoolTotal + transferTo1PoolTotal - transfersOutTotal;

  console.info(cumulativeLiquidity / BigInt(10 ** 18));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });