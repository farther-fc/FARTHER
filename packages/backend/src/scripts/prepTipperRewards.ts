import {
  CHAIN_ID,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  TIPPER_REWARDS_POOL,
  getMerkleRoot,
  neynar,
} from "@farther/common";
import { Address } from "viem";
import { prisma } from "../prisma";

const currentPrice = 0.0025;

async function prepTipperRewards() {
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

  const totalRewardsPool = TIPPER_REWARDS_POOL * currentPrice;

  const leafs = tippers.map((tipper, index) => {
    const user = userData.find((user) => user.fid === tipper.id);

    if (!user) {
      throw new Error(`No user found for fid: ${tipper.id}`);
    }

    const score = tipper.tipperScores[0].score;
    const weight = score / totalScore;
    return {
      address: user.verified_addresses.eth_addresses[0] as Address,
      index,
      amount: BigInt(
        Math.round(weight * totalRewardsPool * 10 ** 18),
      ).toString(),
    };
  });

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

    // await tx.allocation.create({
    //   data: {
    //     totalRewardsPool,
    //     snapshotId: latestSnapshot.id,
    //   },
    // });
  });
}

prepTipperRewards();
