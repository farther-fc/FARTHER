import {
  OPENRANK_BATCH_LIMIT,
  OPENRANK_URL,
  getStartOfMonthUTC,
} from "@farther/common";
import { AxiosResponse } from "axios";
import Bottleneck from "bottleneck";
import { chunk } from "underscore";
import { prisma } from "../prisma";
import { axios } from "./axios";
import { powerBadgeFids } from "./fids";
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

  await fetchScores(powerBadgeFids);

  // for (const fids of tippeeFidChunks) {
  //   const response: OpenRankResponse = await fetch(OPENRANK_URL, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(fids),
  //   }).then((res) => res.json());

  //   const { result } = response;

  //   const snapshotId = getStartOfMonthUTC(0);

  //   await prisma.$transaction(async () => {
  //     prisma.openRankScore.deleteMany({
  //       where: {
  //         snapshotId,
  //         userId: {
  //           in: fids,
  //         },
  //       },
  //     });

  //     prisma.openRankScore.createMany({
  //       data: result.map((r) => ({
  //         snapshotId,
  //         userId: r.fid,
  //         score: r.score,
  //       })),
  //     });
  //   });
  // }
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
  console.log("storing scores", scores);
  await prisma.openRankScore.createMany({
    data: scores.map((r) => ({
      snapshotId: getLatestCronTime(),
      userId: r.fid,
      score: r.score,
    })),
  });
}

// export function getLatestCronTime(): Date {
//   const now = new Date();

//   const hours = now.getUTCHours();

//   // Determine the latest cron run time based on current time
//   if (hours >= CRON_HOURS[1]) {
//     // If current time is after 3pm
//     now.setUTCHours(CRON_HOURS[1], 0, 0, 0);
//   } else if (hours >= CRON_HOURS[0]) {
//     // If current time is after 3am but before 3pm
//     now.setUTCHours(CRON_HOURS[0], 0, 0, 0);
//   } else {
//     // If current time is before 3am
//     now.setUTCDate(now.getUTCDate() - 1);
//     now.setUTCHours(CRON_HOURS[1], 0, 0, 0);
//   }

//   return now;
// }

takeOpenRankSnapshot().catch(console.error);
