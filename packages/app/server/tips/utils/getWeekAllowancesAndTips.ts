import { prisma } from "@farther/backend";
import { dayUTC, getStartOfMonthUTC } from "@farther/common";

// Gets tip allowancs for the past week
export async function getWeekAllowancesAndTips({
  tipperId,
}: {
  tipperId: number;
}) {
  const sevenDaysAgo = dayUTC().subtract(7, "day").toDate();
  const tipAllowances = await prisma.tipAllowance.findMany({
    where: {
      userId: tipperId,
      createdAt: {
        gte: sevenDaysAgo,
      },
      invalidatedAmount: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tips: {
        where: {
          tipperId,
          invalidTipReason: null,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        include: {
          tippee: {
            select: {
              tipAllowances: {
                where: {
                  createdAt: {
                    gte: getStartOfMonthUTC(0),
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

  return tipAllowances;
}
