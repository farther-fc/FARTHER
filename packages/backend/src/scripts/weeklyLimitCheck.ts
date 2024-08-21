import { dayUTC } from "@farther/common";
import { prisma } from "../prisma";

async function weeklyLimitCheck() {
  const tipper = await prisma.user.findFirst({
    where: {
      id: 14553,
    },
    include: {
      tipAllowances: {
        where: {
          createdAt: {
            gte: dayUTC().subtract(7, "days").toDate(),
          },
        },
      },
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: dayUTC().subtract(7, "days").toDate(),
          },
        },
        include: {
          tippee: {
            select: {
              tipAllowances: {
                where: {
                  createdAt: {
                    gte: dayUTC().subtract(7, "days").toDate(),
                  },
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tipper) {
    console.log("no tipper found");
    return;
  }

  const weeklyAllowanceTotal = tipper.tipAllowances.reduce(
    (acc, ta) => acc + ta.amount,
    0,
  );

  const tipsToTippers = tipper.tipsGiven.filter(
    (tip) => tip.tippee.tipAllowances.length > 0,
  );

  const totalGivenToTippers = tipsToTippers.reduce(
    (acc, tip) => acc + tip.amount,
    0,
  );

  console.log({ weeklyAllowanceTotal, totalGivenToTippers });
}

weeklyLimitCheck();
