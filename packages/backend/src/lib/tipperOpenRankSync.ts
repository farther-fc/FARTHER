import { getOpenRankScores } from "@farther/common";
import { prisma } from "../prisma";
import { dbScheduler } from "./utils/helpers";

export async function tipperOpenRankSync() {
  const tippers = await prisma.user.findMany({
    where: {
      isBanned: false,
      tipsGiven: {
        some: {
          invalidTipReason: null,
        },
      },
    },
  });

  const openRankStats = await getOpenRankScores({
    fids: tippers.map((t) => t.id),
    type: "FOLLOWING",
  });

  const promises = tippers.map(async (tipper) => {
    const tipperStats = openRankStats.find((stats) => stats.fid === tipper.id);

    if (!tipperStats) {
      console.warn(`No open rank stats found for tipper ${tipper.id}`);
      return;
    }

    return dbScheduler.schedule(() =>
      prisma.user.update({
        where: {
          id: tipper.id,
        },
        data: {
          orFollowingRank: tipperStats.rank,
        },
      }),
    );
  });

  await Promise.all(promises);

  console.info("Tipper open rank sync complete");
}
