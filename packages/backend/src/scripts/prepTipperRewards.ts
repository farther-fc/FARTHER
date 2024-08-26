import {
  CHAIN_ID,
  ENVIRONMENT,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  TIPPER_REWARDS_POOL,
  getMerkleRoot,
  neynar,
} from "@farther/common";
import { writeFileSync } from "fs";
import { Address } from "viem";
import { createAllocationsCSV } from "../lib/createAllocationsCSV";
import { AllocationType, prisma } from "../prisma";
import { airdropSanityCheck } from "./airdropSanityCheck";

import { v4 as uuidv4 } from "uuid";

async function prepTipperRewards() {
  await airdropSanityCheck({
    date: NEXT_AIRDROP_START_TIME,
    network: "base",
    environment: ENVIRONMENT,
  });

  const latestSnapshot = await prisma.tipperScoreSnapshot.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestSnapshot) {
    throw new Error("No latest snapshot found");
  }

  const tippers = await prisma.user.findMany({
    where: {
      tipperScores: {
        some: {
          snapshotId: latestSnapshot.id,
          score: {
            gt: 0,
          },
        },
      },
    },
    select: {
      id: true,
      tipperScores: {
        where: {
          snapshotId: latestSnapshot.id,
          score: {
            gt: 0,
          },
        },
      },
    },
  });

  const userData = await neynar.getUsersByFid(tippers.map((u) => u.id));

  const totalScore = tippers.reduce((acc, tipper) => {
    return acc + tipper.tipperScores[0].score;
  }, 0);

  const allocations = tippers
    .map((tipper) => {
      const user = userData.find((user) => user.fid === tipper.id);

      if (!user) {
        throw new Error(`No user found for fid: ${tipper.id}`);
      }

      const score = tipper.tipperScores[0].score;
      const weight = score / totalScore;
      return {
        address: user.verified_addresses.eth_addresses[0] as Address,
        fid: user.fid,
        username: user.username,
        amount: weight * TIPPER_REWARDS_POOL,
      };
    })
    .sort((a, b) => b.amount - a.amount)
    .map((a, index) => ({ ...a, index }));

  const leafs = allocations.map((a) => ({
    address: a.address,
    index: a.index,
    amount: getBigIntStringAmount(a.amount),
  }));

  const allocationSum = leafs.reduce(
    (acc, leaf) => BigInt(acc) + BigInt(leaf.amount),
    BigInt(0),
  );

  const root = getMerkleRoot(leafs);

  await prisma.$transaction(async (tx) => {
    const airdrop = await prisma.airdrop.create({
      data: {
        chainId: CHAIN_ID,
        amount: allocationSum.toString(),
        root,
        startTime: NEXT_AIRDROP_START_TIME,
        endTime: NEXT_AIRDROP_END_TIME,
      },
    });

    const createManyResponse = await tx.allocation.createMany({
      data: allocations.map((a, i) => ({
        id: uuidv4(),
        userId: a.fid,
        index: a.index,
        airdropId: airdrop.id,
        type: AllocationType.TIPPER,
        address: a.address.toLowerCase(),
        amount: getBigIntStringAmount(a.amount),
      })),
    });

    console.log(`Created ${createManyResponse.count} allocations`);
  });

  await writeFileSync(
    `airdrops/${ENVIRONMENT}/${AllocationType.TIPPER.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
    JSON.stringify(
      {
        root,
        amount: allocationSum.toString(),
        leafs,
      },
      null,
      2,
    ),
  );

  await createAllocationsCSV({
    allocationType: AllocationType.TIPPER,
    leafs,
  });
}

function getBigIntStringAmount(amount: number) {
  return BigInt(Math.round(amount * 10 ** 18)).toString();
}

prepTipperRewards();
