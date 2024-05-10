import {
  ANVIL_AIRDROP_ADDRESS,
  CHAIN_ID,
  ENVIRONMENT,
  LIQUIDITY_BONUS_MULTIPLIER,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  getMerkleRoot,
} from "@farther/common";
import { v4 as uuidv4 } from "uuid";
import { AllocationType, prisma } from "../prisma";
import { getLpAccounts } from "../utils/getLpAccounts";
import { writeFile } from "../utils/helpers";
import { airdropSanityCheck } from "./airdropSanityCheck";

async function prepareLpBonusDrop() {
  await airdropSanityCheck();

  const accounts = await getLpAccounts();

  // Get all past liquidity reward allocations
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.LIQUIDITY,
    },
    select: {
      address: true,
      // This is the amount that was used as the basis for calculating the bonus
      referenceAmount: true,
    },
  });

  // Group by address and sum amounts for each address
  const pastTotals: Record<string, bigint> = allocations.reduce(
    (acc, a) => ({
      ...acc,
      [a.address]: (acc[a.address] || BigInt(0)) + BigInt(a.referenceAmount),
    }),
    {},
  );

  console.info("pastTotals:", pastTotals);

  // Subtract past liquidity reward allocations from each account's claimed rewards
  const allocationData = accounts.map((a) => {
    const referenceAmount =
      BigInt(a.rewardsClaimed) - (pastTotals[a.id] || BigInt(0));

    // Multiply each by two to get the LP bonus drop amount
    const amount = referenceAmount * BigInt(LIQUIDITY_BONUS_MULTIPLIER);
    return {
      address: a.id,
      amount,
      referenceAmount,
    };
  });

  // Create merkle tree
  const allocationSum = allocationData.reduce(
    (acc, a) => acc + BigInt(a.amount),
    BigInt(0),
  );

  // Create a merkle tree with the above recipients
  const rawLeafData = allocationData.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: r.amount.toString(),
  }));

  const root = getMerkleRoot(rawLeafData);

  // Create Airdrop
  const airdrop = await prisma.airdrop.create({
    data: {
      chainId: CHAIN_ID,
      amount: allocationSum.toString(),
      root,
      address:
        ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
      startTime: NEXT_AIRDROP_START_TIME,
      endTime: NEXT_AIRDROP_END_TIME,
    },
  });

  // Save allocations
  await prisma.allocation.createMany({
    data: allocationData.map((r, i) => ({
      id: uuidv4(),
      index: i,
      airdropId: airdrop.id,
      type: AllocationType.LIQUIDITY,
      address: r.address.toLowerCase(),
      amount: r.amount.toString(),
      referenceAmount: r.referenceAmount.toString(),
    })),
  });

  await writeFile(
    `airdrops/${NETWORK}/${AllocationType.LIQUIDITY.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
    JSON.stringify(
      {
        root,
        amount: allocationSum.toString(),
        rawLeafData,
      },
      null,
      2,
    ),
  );
}

prepareLpBonusDrop().catch(console.error);
