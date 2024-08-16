import { prisma } from "@farther/backend";
import {
  HANDLE_TIP_REGEX,
  RECIPROCATION_THRESHOLD,
  TIPPEE_FOLLOWERS_MIN,
  TIPPEE_WEEKLY_THRESHOLD_RATIO,
  TIP_MINIMUM,
  cacheTypes,
  dayUTC,
  getOpenRankScores,
  getStartOfMonthUTC,
  neynar,
} from "@farther/common";
import { cache } from "@lib/cache";
import { InvalidTipReason } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import { publicProcedure } from "../trpc";
import { tipBot } from "./tipBot";
import { getLatestTipAllowance } from "./utils/getLatestTipAllowance";
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

export const handleTip = publicProcedure.mutation(async (opts) => {
  const body = opts.ctx.req.body;
  const bodyString = JSON.stringify(body);

  // const { isValid, sig } = isNeynarSignatureValid({
  //   rawHeaders: opts.ctx.req.rawHeaders,
  //   bodyString,
  // });

  // if (!isValid) {
  //   throw new Error(`Invalid webhook signature: ${sig}.`);
  // }

  const castData = body.data;
  const createdAtMs = body.created_at;

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

  const tipAllowance = await getLatestTipAllowance({
    tipperId: tipper.fid,
    sinceWhen: tipMeta.createdAt,
  });

  if (!tipAllowance) {
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

  const tipsThisWeek = await getTipsThisWeek({
    tipperFid: tipper.fid,
    createdAtMs,
  });

  const exceededThresholdToTippee = getExceededThresholdToTippee({
    tippeeFid,
    tipsThisWeek,
  });

  const exceededThresholdToTippers = getExceededThresholdToTippers({
    tipsThisWeek,
  });

  const tipsThisCycle = tipsThisWeek.filter(
    (t) => t.allocationId === tipAllowance.id,
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
    tipAllowance.amount - (tipAllowance.invalidatedAmount ?? 0);

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

  console.log({
    invalidTime,
    tipperIsBanned,
    tippeeIsBanned,
    tippeeNotEnoughFollowers,
    alreadyTippedTippee,
    isBelowMinimum,
    exceedsAllowance,
    exceededThresholdToTippee,
    exceededThresholdToTippers,
    invalidTipReason,
  });

  let tipData: TipData;

  if (invalidTipReason) {
    tipData = {
      allowanceId: tipAllowance.id,
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
      allowanceId: tipAllowance.id,
      castHash: castData.hash,
      tipperFid: tipper.fid,
      tippeeFid: tippeeFid,
      tipAmount,
      tippeeOpenRankScore,
    };
  }

  await storeTip(tipData);

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
  });
});

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
  return;
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

async function getTipsThisWeek({
  tipperFid,
  createdAtMs,
}: {
  tipperFid: number;
  createdAtMs: number;
}) {
  const createdAt = dayUTC(createdAtMs).toDate();
  const sevenDaysAgo = dayUTC(createdAtMs).subtract(7, "day").toDate();

  console.log("createdAt", createdAt);
  console.log("sevenDaysAgo", sevenDaysAgo);

  return await prisma.tip.findMany({
    where: {
      tipperId: tipperFid,
      invalidTipReason: null,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      tippee: {
        select: {
          tipsGiven: {
            where: {
              createdAt: {
                gte: getStartOfMonthUTC(0),
              },
            },
            select: {
              hash: true,
            },
          },
        },
      },
    },
  });
}

function getExceededThresholdToTippee({
  tippeeFid,
  tipsThisWeek,
}: {
  tippeeFid: number;
  tipsThisWeek: Awaited<ReturnType<typeof getTipsThisWeek>>;
}) {
  const totalWeeklyAmount = tipsThisWeek.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );
  const tipsToTippee = tipsThisWeek.filter((t) => t.tippeeId === tippeeFid);

  const totalAmountToTippee = tipsToTippee.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  console.log("totalWeeklyAmount", totalWeeklyAmount);
  console.log("totalAmountToTippee", totalAmountToTippee);

  return (
    totalAmountToTippee / totalWeeklyAmount > TIPPEE_WEEKLY_THRESHOLD_RATIO
  );
}

function getExceededThresholdToTippers({
  tipsThisWeek,
}: {
  tipsThisWeek: Awaited<ReturnType<typeof getTipsThisWeek>>;
}) {
  const totalWeeklyAmount = tipsThisWeek.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const tipsToTippers = tipsThisWeek.filter(
    (t) => t.tippee.tipsGiven.length > 0,
  );
  const totalTipsToTippers = tipsToTippers.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );
  return totalTipsToTippers / totalWeeklyAmount > RECIPROCATION_THRESHOLD;
}
