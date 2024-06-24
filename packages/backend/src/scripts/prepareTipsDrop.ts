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

  // Get all users who have received tips since last drop
  const users = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {
          createdAt: {
            gt: lastDropDate,
          },
        },
      },
    },
    select: {
      id: true,
      tipsReceived: {
        where: {
          invalidTipReason: null,
        },
      },
    },
  });

  console.log(
    "Users",
    users
      .map((u) => ({
        id: u.id,
        tipsReceived: u.tipsReceived.reduce((acc, t) => t.amount + acc, 0),
      }))
      .sort((a, b) => b.tipsReceived - a.tipsReceived),
  );

  // Tally up tips for each user
  // Calculate merkle root
  // Save data to DB & json file
}

prepareTipsDrop().catch(console.error);
