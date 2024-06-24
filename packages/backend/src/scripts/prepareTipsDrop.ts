import { AllocationType, prisma } from "../prisma";

async function prepareTipsDrop() {
  // Get date of last tips drop
  const latestTipsAirdrop = await prisma.airdrop.findFirst({
    where: {
      allocations: {
        some: {
          type: AllocationType.TIPS,
        },
      },
    },
  });

  const lastDropDate = latestTipsAirdrop?.createdAt || new Date(0);

  // // Get all users who have received tips since last drop
  // const users = await prisma.user.findMany({
  //   where: {
  //     tipsReceived: {
  //       some: {
  //         createdAt: {
  //           gt: lastDropDate,
  //         },
  //       },
  //     },
  //   },
  //   select: {
  //     id: true,
  //     tipsReceived: true,
  //   },
  // });

  // console.log(
  //   "Users",
  //   users
  //     .map((u) => ({
  //       id: u.id,
  //       tipsReceived: u.tipsReceived.reduce((acc, t) => t.amount + acc, 0),
  //     }))
  //     .sort((a, b) => b.tipsReceived - a.tipsReceived),
  // );

  // Tally up tips for each user
  // Calculate merkle root
  // Save data to DB & json file

  // CHECKING FOR handleTip bug allowing users to tip more than their allowance

  const users = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          createdAt: {
            gt: lastDropDate,
          },
        },
      },
    },
    select: {
      id: true,
      tipAllowances: {
        select: {
          id: true,
          amount: true,
          tips: {
            where: {
              invalidTipReason: null,
            },
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });

  console.log(
    JSON.stringify(
      users
        .map((u) => {
          const overtipped = u.tipAllowances
            .filter(
              (ta) => ta.tips.reduce((acc, t) => t.amount + acc, 0) > ta.amount,
            )
            .map((ta) => ({
              id: ta.id,
              overage:
                ta.tips.reduce((acc, t) => t.amount + acc, 0) - ta.amount,
            }));
          return {
            id: u.id,
            overtipped,
          };
        })
        .filter((u) => u.overtipped.length > 0),
      null,
      2,
    ),
  );

  // // CHECKING DEFTTONY ISSUE
  // const allowance = await prisma.tipAllowance.findFirst({
  //   where: { id: "3f9b4827-4065-455d-b470-f77c99589e44" },
  //   select: {
  //     amount: true,
  //     tips: {
  //       where: {
  //         invalidTipReason: null,
  //       },
  //       select: { amount: true },
  //     },
  //   },
  // });

  // console.log({
  //   allowance: allowance.amount,
  //   tipsSum: allowance.tips.reduce((acc, t) => t.amount + acc, 0),
  // });
}

prepareTipsDrop().catch(console.error);
