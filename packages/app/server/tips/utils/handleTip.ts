import { prisma } from "@farther/backend";
import { HANDLE_TIP_REGEX } from "@farther/common";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { InvalidTipReason } from "@prisma/client";

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

  let invalidTipReason: undefined | InvalidTipReason = undefined;
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

  // Get latest tip allowance
  const tipAllowance = await prisma.tipAllowance.findFirst({
    where: {
      userId: tipper.fid,
      createdAt: {
        gte: tipMeta.createdAt,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tipMinimum = tipMeta.tipMinimum;

  const isAtleastTipMinimum = tipAmount >= tipMinimum;

  if (!tipAllowance) {
    console.warn(`No tip allowance found for user ${tipper.fid}`);
    return;
  }

  const validTime = tipAllowance
    ? createdAtMs > tipAllowance.createdAt.getTime()
    : false;

  if (selfTip || !validTime || !isAtleastTipMinimum) {
    invalidTipReason = selfTip
      ? InvalidTipReason.SELF_TIPPING
      : !validTime
        ? InvalidTipReason.INVALID_TIME
        : InvalidTipReason.BELOW_MINIMUM;

    const tipData = {
      allowanceId: tipAllowance.id,
      tipperFid: tipper.fid,
      tippeeFid: tippee.fid,
      tipAmount,
      invalidTipReason,
      castHash: castData.hash,
    };

    await storeTip(tipData);

    return;
  }

  // Get tips since the latest tip allowance
  const tipsSinceAllowance = await prisma.tip.findMany({
    where: {
      tipperId: tipper.fid,
      invalidTipReason: null,
      createdAt: {
        gte: tipAllowance.createdAt,
      },
    },
  });

  const amountTippedSinceLatestDistribution = tipsSinceAllowance.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  const newTipTotal = amountTippedSinceLatestDistribution + tipAmount;

  if (tipsSinceAllowance.length && newTipTotal > tipAllowance.amount) {
    await storeTip({
      allowanceId: tipAllowance.id,
      castHash: castData.hash,
      tipperFid: tipper.fid,
      tippeeFid: tippee.fid,
      tipAmount,
      invalidTipReason: InvalidTipReason.INSUFFICIENT_ALLOWANCE,
    });
    return;
  }

  await storeTip({
    allowanceId: tipAllowance.id,
    castHash: castData.hash,
    tipperFid: tipper.fid,
    tippeeFid: tippee.fid,
    tipAmount,
  });
}

async function storeTip({
  allowanceId,
  castHash,
  tipperFid,
  tippeeFid,
  tipAmount,
  invalidTipReason,
}: {
  allowanceId: string;
  castHash: string;
  tipperFid: number;
  tippeeFid: number;
  tipAmount: number;
  invalidTipReason?: InvalidTipReason;
}) {
  await prisma.$transaction([
    prisma.tip.create({
      data: {
        hash: castHash,
        amount: tipAmount,
        invalidTipReason,
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
    }),
  ]);
}
