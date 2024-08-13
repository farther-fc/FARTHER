import {
  BREADTH_RATIO_TIP_COUNT_THRESHOLD,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  TIPPER_REQUIRED_FARTHER_BALANCE,
  TIP_MINIMUM,
  WAD_SCALER,
  getOpenRankScores,
  getStartOfMonthUTC,
} from "@farther/common";
import Decimal from "decimal.js";
import { prisma } from "../prisma";
import { getHolders } from "./getHolders";

export async function getEligibleTippers() {
  const allHolders = await getHolders({ includeLPs: true });

  const bannedFids = (
    await prisma.user.findMany({
      where: {
        isBanned: true,
      },
      select: {
        id: true,
      },
    })
  ).map((user) => user.id);

  const eligibleHolders = allHolders.filter((holder) => {
    return (
      !bannedFids.includes(holder.fid) &&
      new Decimal(holder.totalBalance.toString()).gte(
        new Decimal(TIPPER_REQUIRED_FARTHER_BALANCE).mul(WAD_SCALER.toString()),
      )
    );
  });

  const eligibleFidsBasedOnOpenRank = (
    await getOpenRankScores({
      fids: eligibleHolders.map((eh) => eh.fid),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  )
    .filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT)
    .map((score) => score.fid);

  const filteredHolders = eligibleHolders.filter((holder) =>
    eligibleFidsBasedOnOpenRank.includes(holder.fid),
  );

  const include = {
    tipsGiven: {
      where: {
        createdAt: {
          // TODO: change this if snapshot doesn't happen at start of month
          gte: getStartOfMonthUTC(0),
        },
      },
    },
  };

  const existingHolders = await prisma.user.findMany({
    where: {
      id: {
        in: filteredHolders.map((eh) => eh.fid),
      },
      isBanned: false,
    },
    include,
  });

  const existingHolderFids = existingHolders.map((eh) => eh.id);

  const newHolderFids = filteredHolders.filter(
    (eh) => !existingHolderFids.includes(eh.fid),
  );

  const newHolders = await prisma.$transaction(
    newHolderFids.map((user) =>
      prisma.user.create({
        data: {
          id: user.fid,
        },
        include,
      }),
    ),
  );

  return [...existingHolders, ...newHolders].map((holder) => {
    const foundHolder = filteredHolders.find((eh) => eh.fid === holder.id);
    // This is mainly to silence typescript
    if (!foundHolder) {
      throw new Error(`Holder ${holder.id} not found in filteredHolders`);
    }

    let breadthRatio: null | number = null;

    if (holder.tipsGiven.length >= BREADTH_RATIO_TIP_COUNT_THRESHOLD) {
      const uniqueRecipients = new Set(
        holder.tipsGiven.map((tip) => tip.tippeeId),
      ).size;
      const totalAmount = holder.tipsGiven.reduce(
        (acc, tip) => acc + tip.amount,
        0,
      );

      const maxBreadthTipAmount = totalAmount / TIP_MINIMUM;
      const avgTipPerUniqueRecipient = totalAmount / uniqueRecipients;

      breadthRatio =
        (maxBreadthTipAmount / avgTipPerUniqueRecipient +
          uniqueRecipients / holder.tipsGiven.length) /
        2;
    }
    return {
      id: holder.id,
      totalBalance: foundHolder.totalBalance,
      breadthRatio,
    };
  });
}
