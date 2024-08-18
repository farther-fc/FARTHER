import { getStartOfMonthUTC } from "@farther/common";
import { prisma } from "../prisma";

async function reciprocators() {
  const reciprocators = await prisma.user.findMany({
    where: {
      tipsGiven: {
        every: {
          createdAt: {
            gte: getStartOfMonthUTC(0),
          },
          tippee: {
            tipAllowances: {
              some: {
                createdAt: {
                  gte: getStartOfMonthUTC(0),
                },
              },
            },
          },
        },
      },
      NOT: {
        tipsGiven: {
          none: {},
        },
      },
    },
  });

  // console.log(
  //   reciprocators.filter(
  //     (r) =>
  //       // Every tip given to a tipper
  //       r.tipsGiven.length ===
  //       r.tipsGiven.filter((tip) => tip.tippee.tipAllowances.length > 1).length,
  //   ).length,
  // );

  console.log(reciprocators.length);
}

reciprocators();
