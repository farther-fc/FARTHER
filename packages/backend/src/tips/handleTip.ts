import { ENVIRONMENT } from "@farther/common";
import { Cast } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { InvalidTipReason } from "@prisma/client";
import { prisma } from "../prisma";
import Sentry from "@sentry/node";

const regex =
  ENVIRONMENT === "production"
    ? /\d+(\.\d+)?\s*(\$(f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R)|((f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R))|✨)/
    : /\d+(\.\d+)?\s*(\$(f|F)(t|T)(e|E)(s|S)(t|T)|(f|F)(t|T)(e|E)(s|S)(t|T))/;

export async function handleTip({
  castData,
  createdAtMs,
}: {
  castData: Cast;
  createdAtMs: number;
}) {
  const matchingText = castData.text.match(regex);

  if (!matchingText) {
    console.warn("No matching text found in cast", castData.hash);
    return;
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

  // Get latest tip allowance
  const tipAllowance = await prisma.tipAllowance.findFirst({
    where: {
      userId: tipper.fid,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!tipMeta) {
    throw new Error("No tip meta found");
  }

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

    Sentry.captureMessage(`Invalid tip: ${JSON.stringify(tipData)}`);

    await storeTip({
      allowanceId: tipAllowance.id,
      tipperFid: tipper.fid,
      tippeeFid: tippee.fid,
      tipAmount,
      invalidTipReason,
      castHash: castData.hash,
    });

    return;
  }

  // Get tips since the latest tip allowance
  const tipsSinceAllowance = await prisma.tip.findMany({
    where: {
      tipperId: tipper.fid,
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
