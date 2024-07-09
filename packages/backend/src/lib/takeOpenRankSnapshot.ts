import {
  OPENRANK_BATCH_LIMIT,
  OPENRANK_SNAPSHOT_CRON,
  OPENRANK_URL,
  isProduction,
} from "@farther/common";
import { AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { chunk } from "underscore";
import { tippees as dummyTippees } from "../dummy-data/tippees";
import { prisma } from "../prisma";
import { axios } from "./axios";
import { getLatestCronTime } from "./getLatestCronTime";

type OpenRankData = {
  result: {
    fid: number;
    fname: string;
    username: string;
    rank: number;
    score: number;
    percentile: number;
  }[];
};

const OPENRANK_API_KEY = process.env.OPENRANK_API_KEY;

if (!OPENRANK_API_KEY) {
  console.warn("No OPENRANK_API_KEY set! Rate limit will be 10 req/sec.");
}
// const RATE_LIMIT = OPENRANK_API_KEY ? 100 : 10;
const RATE_LIMIT = 10;

export async function takeOpenRankSnapshot() {
  console.log("Running takeOpenRankSnapshot", new Date());

  const tippees = !isProduction
    ? dummyTippees
    : await prisma.user.findMany({
        where: {
          tipsReceived: {
            some: {
              invalidTipReason: null,
            },
          },
        },
        select: {
          id: true,
        },
      });

  const tipeeeFids = tippees.map((t) => t.id);

  await fetchScores(tipeeeFids);
}

const scheduler = new Bottleneck({
  maxConcurrent: 30,
  minTime: 1000 / RATE_LIMIT,
});

const fetchScores = async (fids: number[]) => {
  const fidChunks = chunk(fids, OPENRANK_BATCH_LIMIT);

  await Promise.all(
    fidChunks.map((fids) =>
      scheduler.schedule(() =>
        axios.post(OPENRANK_URL, fids, {
          headers: {
            "API-Key": OPENRANK_API_KEY,
          },
        }),
      ),
    ),
  )
    .then(async (responses: AxiosResponse<OpenRankData>[]) => {
      for (const response of responses) {
        const scores = response.data.result;
        await storeScores(scores);
      }
    })
    .catch((error) => {
      // TODO: Send to Sentry
      console.error(error);
    });
};

async function storeScores(scores: OpenRankData["result"]) {
  const dedupedScores = removeDuplicates(scores);

  const snapshotTimeId = getLatestCronTime(OPENRANK_SNAPSHOT_CRON);

  await prisma.$transaction(
    dedupedScores.map((r) => {
      const data = {
        snapshot: {
          connectOrCreate: {
            where: {
              id: snapshotTimeId,
            },
            create: {
              id: snapshotTimeId,
            },
          },
        },
        user: {
          connectOrCreate: {
            where: {
              id: r.fid,
            },
            create: {
              id: r.fid,
            },
          },
        },
        score: r.score,
      } as const;

      return prisma.openRankScore.upsert({
        where: {
          userId_snapshotId: {
            snapshotId: snapshotTimeId,
            userId: r.fid,
          },
        },
        create: data,
        update: data,
      });
    }),
  );
}

const removeDuplicates = (scores: OpenRankData["result"]) => {
  return scores.filter(
    (item, index, self) =>
      index ===
      self.findIndex((t) => t.fid === item.fid && t.score === item.score),
  );
};

takeOpenRankSnapshot().catch(console.error);
