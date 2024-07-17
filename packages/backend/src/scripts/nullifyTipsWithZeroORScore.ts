import { prisma } from "../prisma";

async function nullifyTipsWithZeroORScore() {
  const tips = await prisma.tip.findMany({
    where: {
      tippeeOpenRankScore: {
        equals: 0,
      },
    },
  });

  console.log("count", tips.length);

  // for (const tip of tips) {
  //   await prisma.tip.update({
  //     where: {
  //       id: tip.id,
  //     },
  //     data: {
  //       tippeeOpenRankScore: null,
  //     },
  //   });
  // }
}

nullifyTipsWithZeroORScore();
