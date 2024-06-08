import { InvalidTipReason, prisma } from "@farther/backend";
import { HANDLE_TIP_REGEX } from "@farther/common";
import * as Sentry from "@sentry/nextjs";
import { publicProcedure } from "server/trpc";

export const handleTip = publicProcedure.mutation(async (opts) => {
  const castData = opts.ctx.req.body.data;
  const createdAtMs = opts.ctx.req.body.created_at * 1000;

  const matchingText = castData.text.match(HANDLE_TIP_REGEX);

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
});

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
