import { prisma } from "@farther/backend";
import {
  HANDLE_TIP_REGEX,
  cacheTypes,
  getOpenRankScores,
  isBanned,
} from "@farther/common";
import { cache } from "@lib/cache";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { InvalidTipReason } from "@prisma/client";
import { getLatestTipAllowance } from "./getLatestTipAllowance";

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
  const tippee = castData.parent_author;

  const selfTip = tipper.fid === tippee.fid;

  if (tippee.fid === null) {
    console.warn("No tippee found in cast", castData.hash);
    return;
  }

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
    console.warn(`No tip allowance found for user ${tipper}`);
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

  const newTipTotal = amountTippedThisCycle + tipAmount;
  const availableAllowance =
    tipAllowance.amount - (tipAllowance.invalidatedAmount ?? 0);

  const isBelowMinimum = tipAmount < tipMeta.tipMinimum;

  const invalidTime = createdAtMs >= tipMeta.createdAt.getTime();

  const exceedsAllowance = newTipTotal > availableAllowance;

  const invalidTipReason = selfTip
    ? InvalidTipReason.SELF_TIPPING
    : !invalidTime
      ? InvalidTipReason.INVALID_TIME
      : isBanned(tippee.fid)
        ? InvalidTipReason.BANNED_TIPPEE
        : isBanned(tipper.fid)
          ? InvalidTipReason.BANNED_TIPPER
          : isBelowMinimum
            ? InvalidTipReason.BELOW_MINIMUM
            : exceedsAllowance
              ? InvalidTipReason.INSUFFICIENT_ALLOWANCE
              : null;

  if (invalidTipReason) {
    const tipData = {
      allowanceId: tipAllowance.id,
      tipperFid: tipper.fid,
      tippeeFid: tippee.fid,
      tipAmount,
      invalidTipReason,
      castHash: castData.hash,
      tippeeOpenRankScore: null,
    };

    await storeTip(tipData);

    return;
  }

  const openRankScores = await getOpenRankScores([tippee.fid]);

  const tippeeOpenRankScore =
    openRankScores && openRankScores[0] ? openRankScores[0].score : null;

  await storeTip({
    allowanceId: tipAllowance.id,
    castHash: castData.hash,
    tipperFid: tipper.fid,
    tippeeFid: tippee.fid,
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

  await cache.flush({ type: cacheTypes.USER, id: tipperFid });
  await cache.flush({ type: cacheTypes.USER_TIPS, id: tipperFid });
}
