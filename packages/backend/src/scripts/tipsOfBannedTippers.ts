import { getStartOfMonthUTC } from "@farther/common";
import { prisma } from "../prisma";

async function tipsOfBannedTippers() {
  const bannedTips = await prisma.tip.findMany({
    where: {
      invalidTipReason: null,
      createdAt: {
        gte: getStartOfMonthUTC(0),
      },
      AND: [
        {
          tipper: {
            isBanned: true,
          },
        },
        {
          tippee: {
            isBanned: true,
          },
        },
      ],
    },
  });

  console.log("Banned tips of the month: ", bannedTips.length);
  console.log(
    `Total amount: ${bannedTips.reduce((acc, tip) => acc + tip.amount, 0)}`,
  );
}

tipsOfBannedTippers();
