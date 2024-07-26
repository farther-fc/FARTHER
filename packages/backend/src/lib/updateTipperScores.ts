import { OPENRANK_SNAPSHOT_INTERVAL, cacheTypes } from "@farther/common";
import * as Sentry from "@sentry/node";
import { Job, QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { chunk } from "underscore";
import { Tip, prisma } from "../prisma";
import { queueConnection, queueNames, updateTipperScoresQueue } from "./bullmq";
import { getLatestOpenRankScores } from "./getLatestOpenRankScores";
import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getTippersByDate } from "./getTippersByDate";
import { flushCache } from "./utils/flushCache";
import { getTipScores } from "./utils/getTipScores";
import { dbScheduler } from "./utils/helpers";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

// NOTE this can't be very big because of vercel/kv memory limit (10265353)
const BATCH_SIZE = 30;

type TipperChunk = [
  string,
  {
    hash: string;
    tipperId: number;
    tippeeId: number;
    createdAt: Date;
    amount: number;
    startScore: number;
  }[],
][];

new Worker(queueNames.TIPPER_SCORES, updateTipperScoresBatch, {
  connection: queueConnection,
  concurrency: 5,
});

let totalJobs: number;
let completedJobs = 0;
const allTipperFids: number[] = [];

export async function updateTipperScores() {
  console.log(`STARTING updateTipperScores`, new Date());

  const latestAirdrop = await getLatestTipperAirdrop();
  const tippers = await getTippersByDate({
    from: latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE,
    // Recent tips won't have an OpenRank score change yet
    to: dayjs().subtract(OPENRANK_SNAPSHOT_INTERVAL, "hours").toDate(),
  });

  allTipperFids.push(...tippers.map((tipper) => tipper.id));

  const tips = tippers.map((tipper) => tipper.tipsGiven).flat();

  // Tips grouped by tipper
  const tipSnapshots: {
    [tipperId: number]: {
      hash: string;
      tipperId: number;
      tippeeId: number;
      createdAt: Date;
      amount: number;
      startScore: number;
    }[];
  } = {};

  tips.forEach((tip) => {
    if (!tipSnapshots[tip.tipperId]) {
      tipSnapshots[tip.tipperId] = [];
    }
    if (tip.tippeeOpenRankScore === null) {
      throw new Error(
        `Tipper ${tip.tipperId} has a tip with no tippeeOpenRankScore`,
      );
    }
    tipSnapshots[tip.tipperId].push({
      hash: tip.hash,
      tipperId: tip.tipperId,
      tippeeId: tip.tippeeId,
      createdAt: tip.createdAt,
      amount: tip.amount,
      startScore: tip.tippeeOpenRankScore,
    });
  });

  const chunkedTippers = chunk(Object.entries(tipSnapshots), BATCH_SIZE);

  totalJobs = chunkedTippers.length;

  // Putting the hour in the job name to avoid collisions
  const date = dayjs();
  const day = date.format("YYYY-MM-DD");
  const hour = date.format("hh");

  // Create jobs
  await updateTipperScoresQueue.addBulk(
    chunkedTippers.map((tippers, i) => {
      const jobId = `updateTipperScores-${day}-h${hour}-batch:${i * BATCH_SIZE + tippers.length}`;
      return {
        name: jobId,
        data: { tippers },
        opts: { jobId, attempts: 5 },
      };
    }),
  );
}

async function updateTipperScoresBatch(job: Job) {
  const tippers = job.data.tippers as TipperChunk;

  console.info(`Starting job ${job.id} with ${tippers.length} tippers`);

  const tipperScores: { fid: string; score: number }[] = [];

  const tipUpdates: Promise<Tip>[] = [];

  for (const [fid, tips] of tippers) {
    const tipees = new Set(tips.map((tip) => tip.tippeeId));
    const endScores = await getLatestOpenRankScores(Array.from(tipees));

    const tipScores = await getTipScores({
      tips,
      endScores,
    });

    const totalScore = tipScores.reduce(
      (acc, score) => acc.add(score.changePerToken),
      new Decimal(0),
    );

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

    // Return average
    const tipperScore = totalScore.div(tips.length);

    tipperScores.push({ fid, score: tipperScore.toNumber() });
  }

  await Promise.all(tipUpdates);

  console.info(`Creating ${tipperScores.length} tipper scores`);

  await prisma.tipperScore.createMany({
    data: tipperScores.map(({ fid, score }) => ({
      userId: parseInt(fid),
      score,
    })),
  });

  return tipperScores.map(({ fid }) => fid);
}

const queueEvents = new QueueEvents(queueNames.TIPPER_SCORES, {
  connection: queueConnection,
});

queueEvents.on("stalled", async (job) => {
  console.error(`${queueNames.TIPPER_SCORES} stalled job: ${job.jobId}`);
});

queueEvents.on("failed", async (job) => {
  const message = `${queueNames.TIPPER_SCORES} failed job: ${job.jobId}. Reason: ${job.failedReason}`;
  console.error(message);
  Sentry.captureException(message);
});

queueEvents.on("error", (error) => {
  console.error(`Error in worker: ${error}`);
  Sentry.captureException(error, {
    captureContext: {
      tags: {
        jobQueue: queueNames.TIPPER_SCORES,
      },
    },
  });
});

queueEvents.on("completed", async (job) => {
  completedJobs++;

  console.info(`${job.jobId} completed (${completedJobs}/${totalJobs}).`);

  if (completedJobs === totalJobs) {
    await flushCache({
      type: cacheTypes.USER,
      ids: allTipperFids,
    });
    await flushCache({
      type: cacheTypes.USER_TIPS,
    });
    await flushCache({
      type: cacheTypes.LEADERBOARD,
    });
    console.info(`FINISHED ${queueNames.TIPPER_SCORES}`);
    totalJobs = 0;
    completedJobs = 0;
  }
});
