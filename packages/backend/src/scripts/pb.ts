import { prisma } from "../prisma";

async function pb() {
  const pbTippers = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {},
      },
    },
  });

  const pbTippersWithPowerBadge = pbTippers.filter((t) => t.powerBadge);

  console.info(`Power Badge Tippers: ${pbTippersWithPowerBadge.length}`);
  console.info(`Total Tippers: ${pbTippers.length}`);
}

pb();
