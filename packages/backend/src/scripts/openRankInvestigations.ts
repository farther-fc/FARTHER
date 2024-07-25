import Decimal from "decimal.js";
import { prisma } from "../prisma";

async function byOrScore() {
  const tips = await prisma.tip.findMany({
    where: {
      tippeeOpenRankScore: {
        not: null,
      },
    },
  });

  const sortedTips = tips.sort((a, b) =>
    new Decimal(b.tippeeOpenRankScore || 0)
      .sub(new Decimal(a.tippeeOpenRankScore || 0))
      .toNumber(),
  );

  sortedTips.slice(0, 30).forEach((tip) => {
    console.log({
      score: tip.tippeeOpenRankScore,
      link: `https://warpcast.com/~/profiles/${tip.tippeeId}`,
    });
  });
}

async function byOrChange() {
  const tips = await prisma.tip.findMany({
    where: {
      openRankChange: {
        not: null,
      },
    },
  });

  const sortedTips = tips.sort((a, b) =>
    new Decimal(b.openRankChange || 0)
      .sub(new Decimal(a.openRankChange || 0))
      .toNumber(),
  );

  sortedTips.slice(0, 30).forEach((tip) => {
    console.log({
      openRankChange: tip.openRankChange,
      tippeeOpenRankScore: tip.tippeeOpenRankScore,
      link: `https://warpcast.com/~/conversations/${tip.hash}`,
    });
  });
}

// byOrScore();
byOrChange();
