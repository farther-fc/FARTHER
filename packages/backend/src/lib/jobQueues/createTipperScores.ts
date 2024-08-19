import {
  ACTIVE_TIP_DAYS_REQUIRED,
  ENVIRONMENT,
  OPENRANK_SNAPSHOT_INTERVAL,
  ROOT_ENDPOINT,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  axios,
  cacheTypes,
  cronSchedules,
  dayUTC,
  getOpenRankScores,
  getStartOfMonthUTC,
  isProduction,
} from "@farther/common";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { Tip, prisma } from "../../prisma";
import {
  createTipperScoresQueue,
  getJobCounts,
  logQueueEvents,
  queueConnection,
  queueNames,
} from "../bullmq";
import { getLatestCronTime } from "../getLatestCronTime";
import { getLatestOpenRankScores } from "../getLatestOpenRankScores";
import { getTipsFromDate } from "../getTipsFromDate";
import { flushCache } from "../utils/flushCache";
import { getTipScores } from "../utils/getTipScores";
import { dbScheduler } from "../utils/helpers";

// const allScores: {
//   username: string | null;
//   fid: number;
//   score: number;
//   tipScores: { hash: string; changePerToken: Decimal }[];
// }[] = [];

type JobData = {
  fid: number;
  from: Date;
  to: Date;
};

new Worker(queueNames.CREATE_TIPPER_SCORES, createTipperScoresBatch, {
  connection: queueConnection,
  concurrency: 5,
});

const snapshotTimeId = getLatestCronTime(cronSchedules.CREATE_TIPPER_SCORES);

export async function createTipperScores() {
  console.info(`STARTING: ${queueNames.CREATE_TIPPER_SCORES}`);

  await createTipperScoresQueue.obliterate();

  const from = await getTipsFromDate();

  // Recent tips won't have an OpenRank score change yet
  const to = isProduction
    ? dayUTC().subtract(OPENRANK_SNAPSHOT_INTERVAL, "hours").toDate()
    : dayUTC().toDate();

  const tippers = await prisma.user.findMany({
    where: {
      isBanned: false,
      tipsGiven: {
        some: getTipsGivenWhereFilter({ from, to }),
      },
    },
    include: {
      tipsGiven: {
        where: getTipsGivenWhereFilter({ from, to }),
      },
    },
  });

  const openRankFids = (
    await getOpenRankScores({
      fids: tippers.map((t) => t.id),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  )
    .filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT)
    .map((data) => data.fid);

  const tippersBelowOpenRankThreshold = tippers.filter((t) =>
    openRankFids.includes(t.id),
  );

  // Putting the hour in the job name to avoid collisions
  const date = dayjs();
  const day = date.format("YYYY-MM-DD");
  const hour = date.hour();

  const tippersWithEnoughActiveDays = tippersBelowOpenRankThreshold.filter(
    (tipper) => {
      const totalActiveDays = new Set(
        tipper.tipsGiven.map((t) => t.tipAllowanceId),
      ).size;

      return totalActiveDays >= ACTIVE_TIP_DAYS_REQUIRED;
    },
  );

  console.log(
    `${queueNames.CREATE_TIPPER_SCORES}: Creating ${tippersWithEnoughActiveDays.length} jobs`,
  );

  // Create jobs
  await createTipperScoresQueue.addBulk(
    tippersWithEnoughActiveDays.map((tipper) => {
      const jobId = `${queueNames.CREATE_TIPPER_SCORES}-${day}-h${hour}-fid:${tipper.id}`;
      return {
        name: jobId,
        data: { fid: tipper.id, from, to },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

async function createTipperScoresBatch(job: Job) {
  const { fid, from, to } = job.data as JobData;

  const tipperData = await prisma.user.findUnique({
    where: {
      id: fid,
    },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          tippeeOpenRankScore: {
            not: null,
          },
          tippee: {
            NOT: {
              tipAllowances: {
                some: {
                  createdAt: {
                    gte: getStartOfMonthUTC(0),
                  },
                },
              },
            },
          },
          createdAt: {
            gte: from,
            lt: to,
          },
        },
      },
    },
  });

  if (!tipperData) {
    throw new Error(`No tipper data found for fid: ${fid}`);
  }

  if (tipperData.tipsGiven.length === 0) {
    console.log(`No tips found for fid: ${fid}`);
    return;
  }

  const tips = tipperData.tipsGiven;

  const tipees = new Set(tips.map((tip) => tip.tippeeId));
  const endScores = await getLatestOpenRankScores(Array.from(tipees));

  const tipScores = getTipScores({
    tips,
    endScores,
  });

  const tipperScore = tipScores.reduce(
    (acc, score) => acc.add(score.changePerToken),
    new Decimal(0),
  );

  const tipUpdates: Promise<Tip>[] = [];

  tipUpdates.push(
    ...tipScores.map((tip, index) =>
      dbScheduler.schedule(() =>
        prisma.tip.update({
          where: { hash: tip.hash },
          data: {
            openRankChange: tipScores[index].changePerToken.toNumber(),
          },
        }),
      ),
    ),
  );

  await Promise.all(tipUpdates);

  try {
    await prisma.tipperScoreSnapshot.upsert({
      where: {
        id: snapshotTimeId,
      },
      create: {
        id: snapshotTimeId,
      },
      update: {},
    });

    await prisma.tipperScore.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              id: fid,
            },
            create: {
              id: fid,
            },
          },
        },
        score: tipperScore.toNumber(),
        snapshot: {
          connect: {
            id: snapshotTimeId,
          },
        },
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        fid,
        tipperScore: tipperScore.toNumber(),
        env: ENVIRONMENT,
      },
    });
  }

  await flushCache({
    type: cacheTypes.USER,
    ids: [fid],
  });

  // allScores.push({
  //   username: tipperData.username,
  //   fid: fid,
  //   score: tipperScore.toNumber(),
  //   tipScores,
  // });
}

const queueEvents = new QueueEvents(queueNames.CREATE_TIPPER_SCORES, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.CREATE_TIPPER_SCORES });

queueEvents.on("completed", async (job) => {
  const { total, completed, failed } = await getJobCounts(
    createTipperScoresQueue,
  );

  console.info(`done: ${job.jobId} (${completed}/${total}).`);

  if (total === completed + failed) {
    // await writeFile(
    //   `tipperScores.json`,
    //   JSON.stringify(
    //     allScores
    //       .sort((a, b) => b.score - a.score)
    //       .map((s, i) => ({ ...s, rank: i + 1 })),
    //     null,
    //     2,
    //   ),
    // );

    // const tipScores = allScores
    //   .map((a) => a.tipScores)
    //   .flat()
    //   .sort((a, b) => b.changePerToken.comparedTo(a.changePerToken));
    // const biggestScores = tipScores.slice(0, 5);
    // const smallestScores = tipScores.slice(-5);

    // console.log("Biggest scores", biggestScores);
    // console.log("Smallest scores", smallestScores);

    // await flushCache({
    //   type: cacheTypes.USER_TIPS,
    // });
    // await flushCache({
    //   type: cacheTypes.LEADERBOARD,
    // });

    console.info(
      `ALL DONE: ${queueNames.CREATE_TIPPER_SCORES}`,
      failed > 0 ? `- FAILED JOBS: ${failed}` : "",
    );

    await createTipperScoresQueue.drain();

    // Load the leaderboard to update the cache
    await axios.get(`${ROOT_ENDPOINT}/tips/leaderboard`);
  }
});

function getTipsGivenWhereFilter({ from, to = new Date() }) {
  return {
    invalidTipReason: null,
    tippeeOpenRankScore: {
      not: null,
    },
    createdAt: {
      gte: from,
      lt: to,
    },
  } as const;
}
