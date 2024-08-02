import { prisma } from "@farther/backend";
import {
  HANDLE_TIP_REGEX,
  TIPPEE_FOLLOWERS_MIN,
  TIP_MINIMUM,
  cacheTypes,
  getOpenRankScores,
  neynarLimiter,
} from "@farther/common";
import { cache } from "@lib/cache";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { InvalidTipReason } from "@prisma/client";
import { getLatestTipAllowance } from "./getLatestTipAllowance";
import { isBanned } from "./isBanned";

export async function handleTip({
  castData,
  createdAtMs,
}: {
  castData: Cast;
  createdAtMs: number;
}) {
  const matchingText = castData.text.match(HANDLE_TIP_REGEX);

  if (!matchingText) {
    throw new Error(`No matching text found in cast: ${castData.hash}`);
  }

  const tipper = castData.author;
  const tippeeFid = castData.parent_author.fid;

  const selfTip = tipper.fid === tippeeFid;

  if (tippeeFid === null) {
    console.warn("No tippee found in cast", castData.hash);
    return;
  }

  const tippee = await prisma.user.findFirst({
    where: {
      id: tippeeFid,
    },
  });

  let tippeeFollowerCount = tippee?.followerCount;

  if (!tippee) {
    // Get tippee from Neynar
    const [tippeeNeynar] = await neynarLimiter.getUsersByFid([tippeeFid]);

    if (!tippeeNeynar) {
      throw new Error(`No tippee found in Neynar: ${tippeeFid}`);
    }

    tippeeFollowerCount = tippeeNeynar.follower_count;
  }

  const tippeeNotEnoughFollowers =
    (tippeeFollowerCount || 0) < TIPPEE_FOLLOWERS_MIN;

  const tipAmount = parseFloat(matchingText[0]);

  const tipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tipMeta) {
    throw new Error("No tip meta found");
  }

  const tipAllowance = await getLatestTipAllowance({
    tipperId: tipper.fid,
    sinceWhen: tipMeta.createdAt,
  });

  if (!tipAllowance) {
    console.warn(`No tip allowance found for user ${tipper.fid}`);
    return;
  }

  const tipsThisCycle = await prisma.tip.findMany({
    where: {
      tipAllowanceId: tipAllowance.id,
      invalidTipReason: null,
    },
  });

  const amountTippedThisCycle = tipsThisCycle.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const hasAlreadyTippedTippee = tipsThisCycle.some(
    (tip) => tip.tippeeId === tippeeFid,
  );

  const newTipTotal = amountTippedThisCycle + tipAmount;
  const availableAllowance =
    tipAllowance.amount - (tipAllowance.invalidatedAmount ?? 0);

  const isBelowMinimum =
    tipAmount < TIP_MINIMUM &&
    // TODO: remove this clause after Aug 3
    tipMeta.id !== "a8b63c87-1d52-4769-ac0c-74d3312541f0";

  const invalidTime = createdAtMs >= tipMeta.createdAt.getTime();

  const exceedsAllowance = newTipTotal > availableAllowance;

  const [tipperIsBanned, tippeeIsBanned] = await isBanned([
    tipper.fid,
    tippeeFid,
  ]);

  const invalidTipReason = selfTip
    ? InvalidTipReason.SELF_TIPPING
    : !invalidTime
      ? InvalidTipReason.INVALID_TIME
      : tipperIsBanned
        ? InvalidTipReason.BANNED_TIPPER
        : tippeeIsBanned
          ? InvalidTipReason.BANNED_TIPPEE
          : tippeeNotEnoughFollowers
            ? InvalidTipReason.INELIGIBLE_TIPPEE
            : hasAlreadyTippedTippee
              ? InvalidTipReason.TIPPEE_LIMIT_REACHED
              : isBelowMinimum
                ? InvalidTipReason.BELOW_MINIMUM
                : exceedsAllowance
                  ? InvalidTipReason.INSUFFICIENT_ALLOWANCE
                  : null;

  if (invalidTipReason) {
    const tipData = {
      allowanceId: tipAllowance.id,
      tipperFid: tipper.fid,
      tippeeFid: tippeeFid,
      tipAmount,
      invalidTipReason,
      castHash: castData.hash,
      tippeeOpenRankScore: null,
    };

    await storeTip(tipData);

    return;
  }

  const openRankScores = await getOpenRankScores([tippeeFid]);

  const tippeeOpenRankScore =
    openRankScores && openRankScores[0] ? openRankScores[0].score : null;

  await storeTip({
    allowanceId: tipAllowance.id,
    castHash: castData.hash,
    tipperFid: tipper.fid,
    tippeeFid: tippeeFid,
    tipAmount,
    tippeeOpenRankScore,
  });
}

async function storeTip({
  allowanceId,
  castHash,
  tipperFid,
  tippeeFid,
  tipAmount,
  invalidTipReason,
  tippeeOpenRankScore,
}: {
  allowanceId: string;
  castHash: string;
  tipperFid: number;
  tippeeFid: number;
  tipAmount: number;
  invalidTipReason?: InvalidTipReason;
  tippeeOpenRankScore: number | null;
}) {
  await prisma.tip.create({
    data: {
      hash: castHash,
      amount: tipAmount,
      invalidTipReason,
      tippeeOpenRankScore,
      tipper: {
        connectOrCreate: {
          where: { id: tipperFid },
          create: { id: tipperFid },
        },
      },
      tipAllowance: {
        connect: {
          id: allowanceId,
        },
      },
      tippee: {
        connectOrCreate: {
          where: { id: tippeeFid },
          create: { id: tippeeFid },
        },
      },
    },
  });

  await cache.flush({ type: cacheTypes.USER, ids: [tipperFid] });
  await cache.flush({ type: cacheTypes.USER_TIPS, ids: [tipperFid] });
}
