import { getStartOfMonthUTC } from "@farther/common";
import { chunk } from "underscore";
import { prisma } from "./../prisma";

type OpenRankResponse = {
  result: {
    fid: number;
    fname: string;
    username: string;
    rank: number;
    score: number;
    percentile: number;
  }[];
};
const OPENRANK_BATCH_MAX = 100;

const OPENRANK_URL = "https://graph.cast.k3l.io/scores/global/engagement/fids";

export const SNAPSHOT_DAY = 0;

export async function takeOpenRankSnapshot() {
  console.log("Running takeOpenRankSnapshot", new Date());

  const latestOpenRankSnapshot = await prisma.openRankSnapshot.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const tips = await prisma.tip.findMany({
    where: {
      AND: [
        {
          createdAt: {
            gte: latestOpenRankSnapshot?.createdAt ?? getStartOfMonthUTC(-1),
          },
        },
        {
          // This is to handle the case where a snapshot fails
          // and we need to re-run it.
          tippee: {
            NOT: {
              openRankScores: {
                some: {
                  snapshotId: getStartOfMonthUTC(0),
                },
              },
            },
          },
        },
      ],
    },
    select: {
      tippeeId: true,
    },
  });

  const tipeeeFids = tips.map((t) => t.tippeeId);

  const tippeeFidChunks = chunk(tipeeeFids, OPENRANK_BATCH_MAX);

  for (const fids of tippeeFidChunks) {
    const response: OpenRankResponse = await fetch(OPENRANK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fids),
    }).then((res) => res.json());

    const { result } = response;

    const snapshotId = getStartOfMonthUTC(0);

    await prisma.$transaction(async () => {
      prisma.openRankScore.deleteMany({
        where: {
          snapshotId,
          userId: {
            in: fids,
          },
        },
      });

      prisma.openRankScore.createMany({
        data: result.map((r) => ({
          snapshotId,
          userId: r.fid,
          score: r.score,
        })),
      });
    });
  }
}

takeOpenRankSnapshot().catch(console.error);
