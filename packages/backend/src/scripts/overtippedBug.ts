import { AllocationType, prisma } from "../prisma";

async function overtippedBug() {
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
}

overtippedBug().catch(console.error);
