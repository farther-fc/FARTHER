import { prisma } from "@farther/backend";
import {
  HANDLE_TIP_REGEX,
  RECIPROCATION_THRESHOLD,
  TIPPEE_FOLLOWERS_MIN,
  TIPPEE_WEEKLY_THRESHOLD_RATIO,
  TIP_MINIMUM,
  cacheTypes,
  getOpenRankScores,
  getStartOfMonthUTC,
  neynar,
} from "@farther/common";
import { cache } from "@lib/cache";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { InvalidTipReason } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { tipBot } from "./tipBot";
import { getWeekAllowancesAndTips } from "./utils/getWeekAllowancesAndTips";
import { isBanned } from "./utils/isBanned";

type TipData = {
  allowanceId: string;
  castHash: string;
  tipperFid: number;
  tippeeFid: number;
  tipAmount: number;
  invalidTipReason?: InvalidTipReason;
  tippeeOpenRankScore: number | null;
};

export async function processTip({
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

  if (tippeeFid === null) {
    console.warn("No tippee found in cast", castData.hash);
    return;
  }

  // Get tippee from Neynar
  const [tippeeNeynar] = await neynar.getUsersByFid([tippeeFid]);

  if (!tippeeNeynar) {
    throw new Error(`No tippee found in Neynar: ${tippeeFid}`);
  }

  const tippeeFollowerCount = tippeeNeynar.follower_count;

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

  const selfTip = tipper.fid === tippeeFid;

  const invalidTime = createdAtMs < tipMeta.createdAt.getTime();

  const tipAllowances = await getWeekAllowancesAndTips({
    tipperId: tipper.fid,
  });

  const latestTipAllowance = tipAllowances[0];

  if (!latestTipAllowance) {
    console.warn(`No tip allowance found for user ${tipper.fid}`);
    tipBot({
      amountTippedThisCycle: 0,
      tipAmount,
      invalidTipReason: InvalidTipReason.NULL_ALLOWANCE,
      tipper: tipper.username,
      tippee: tippeeNeynar.username,
      availableAllowance: 0,
      tipHash: castData.hash,
    });
    return;
  }

  const tipsThisWeek = tipAllowances.map((ta) => ta.tips).flat();

  const weekAllowancesTotal = tipAllowances.reduce(
    (total, ta) => total + ta.amount,
    0,
  );

  const { exceededThresholdToTippee, validAmount: tippeeValidAmount } =
    getExceededThresholdToTippee({
      tippeeFid,
      tipsThisWeek,
      weekAllowancesTotal,
      currentAmount: tipAmount,
    });

  const {
    exceededThresholdToTippers,
    validAmount: tippersValidAmount,
    totalWeekAmtToTippers,
  } = await getExceededThresholdToTippers({
    tipsThisWeek,
    weekAllowancesTotal,
    currentAmount: tipAmount,
    tippeeFid,
  });

  const tipsThisCycle = tipsThisWeek.filter(
    (t) => t.tipAllowanceId === latestTipAllowance.id,
  );

  const amountTippedSoFar = tipsThisCycle.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const alreadyTippedTippee = tipsThisCycle.some(
    (tip) => tip.tippeeId === tippeeFid,
  );

  const amountTippedThisCycle = amountTippedSoFar + tipAmount;
  const availableAllowance =
    latestTipAllowance.amount - (latestTipAllowance.invalidatedAmount ?? 0);

  const isBelowMinimum = tipAmount < TIP_MINIMUM;

  const exceedsAllowance = amountTippedThisCycle > availableAllowance;

  const [tipperIsBanned, tippeeIsBanned] = await isBanned([
    tipper.fid,
    tippeeFid,
  ]);

  const invalidTipReason = selfTip
    ? InvalidTipReason.SELF_TIPPING
    : invalidTime
      ? InvalidTipReason.INVALID_TIME
      : tipperIsBanned
        ? InvalidTipReason.BANNED_TIPPER
        : tippeeIsBanned
          ? InvalidTipReason.BANNED_TIPPEE
          : tippeeNotEnoughFollowers
            ? InvalidTipReason.INELIGIBLE_TIPPEE
            : alreadyTippedTippee
              ? InvalidTipReason.TIPPEE_LIMIT_REACHED
              : isBelowMinimum
                ? InvalidTipReason.BELOW_MINIMUM
                : exceedsAllowance
                  ? InvalidTipReason.INSUFFICIENT_ALLOWANCE
                  : exceededThresholdToTippee
                    ? InvalidTipReason.TIPPEE_WEEKLY_THRESHOLD_REACHED
                    : exceededThresholdToTippers
                      ? InvalidTipReason.RECIPROCATION_THRESHOLD_REACHED
                      : null;

  const allowableAmount =
    invalidTipReason === InvalidTipReason.TIPPEE_WEEKLY_THRESHOLD_REACHED
      ? tippeeValidAmount
      : invalidTipReason === InvalidTipReason.RECIPROCATION_THRESHOLD_REACHED
        ? tippersValidAmount
        : 0;

  let tipData: TipData;

  if (invalidTipReason) {
    tipData = {
      allowanceId: latestTipAllowance.id,
      tipperFid: tipper.fid,
      tippeeFid: tippeeFid,
      tipAmount,
      invalidTipReason,
      castHash: castData.hash,
      tippeeOpenRankScore: null,
    };
  } else {
    let tippeeOpenRankScore: number | null = null;
    try {
      const openRankScores = await getOpenRankScores({
        fids: [tippeeFid],
        type: "ENGAGEMENT",
      });
      tippeeOpenRankScore =
        openRankScores && openRankScores[0] ? openRankScores[0].score : null;
    } catch (error) {
      Sentry.captureException(error);
    }
    tipData = {
      allowanceId: latestTipAllowance.id,
      castHash: castData.hash,
      tipperFid: tipper.fid,
      tippeeFid: tippeeFid,
      tipAmount,
      tippeeOpenRankScore,
    };
  }

  const tip = await storeTip(tipData);

  tipBot({
    amountTippedThisCycle: invalidTipReason
      ? amountTippedSoFar
      : amountTippedThisCycle,
    invalidTipReason,
    tipAmount,
    tipper: tipper.username,
    tippee: tippeeNeynar.username,
    availableAllowance: availableAllowance,
    tipHash: castData.hash,
    allowableAmount,
    weekAllowancesTotal: weekAllowancesTotal,
    totalWeekAmtToTippers,
  });

  return tip;
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
  return await prisma.tip.create({
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

export function getExceededThresholdToTippee({
  tippeeFid,
  tipsThisWeek,
  weekAllowancesTotal,
  currentAmount,
}: {
  tippeeFid: number;
  tipsThisWeek: Awaited<
    ReturnType<typeof getWeekAllowancesAndTips>
  >[number]["tips"];
  weekAllowancesTotal: number;
  currentAmount: number;
}) {
  const tipsToTippee = tipsThisWeek.filter((t) => t.tippeeId === tippeeFid);

  const totalWeeklyToTippee = tipsToTippee.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const validAmount =
    weekAllowancesTotal * TIPPEE_WEEKLY_THRESHOLD_RATIO - totalWeeklyToTippee;

  return {
    exceededThresholdToTippee:
      (totalWeeklyToTippee + currentAmount) / weekAllowancesTotal >
      TIPPEE_WEEKLY_THRESHOLD_RATIO,
    validAmount: validAmount > 0 ? validAmount : 0,
  };
}

export async function getExceededThresholdToTippers({
  tipsThisWeek,
  weekAllowancesTotal,
  currentAmount,
  tippeeFid,
}: {
  tipsThisWeek: Awaited<
    ReturnType<typeof getWeekAllowancesAndTips>
  >[number]["tips"];
  weekAllowancesTotal: number;
  currentAmount: number;
  tippeeFid: number;
}) {
  const tipsToTippers = tipsThisWeek.filter(
    (t) => t.tippee.tipAllowances.length > 0,
  );

  const tippee = await prisma.user.findUnique({
    where: {
      id: tippeeFid,
      tipAllowances: {
        some: {
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!tippee) {
    return {
      exceededThresholdToTippers: false,
      validAmount: 0,
    };
  }

  const totalWeekAmtToTippers = tipsToTippers.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const validAmount =
    weekAllowancesTotal * RECIPROCATION_THRESHOLD - totalWeekAmtToTippers;

  return {
    exceededThresholdToTippers:
      (totalWeekAmtToTippers + currentAmount) / weekAllowancesTotal >
      RECIPROCATION_THRESHOLD,
    validAmount: validAmount > 0 ? validAmount : 0,
    totalWeekAmtToTippers,
  };
}
