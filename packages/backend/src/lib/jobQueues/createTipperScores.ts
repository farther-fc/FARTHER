import { OPENRANK_SNAPSHOT_INTERVAL, cacheTypes } from "@farther/common";
import { Job, QueueEvents, Worker } from "bullmq";
import dayjs from "dayjs";
import Decimal from "decimal.js";
import { Tip, prisma } from "../../prisma";
import {
  createTipperScoresQueue,
  logQueueEvents,
  queueConnection,
  queueNames,
} from "../bullmq";
import { getLatestOpenRankScores } from "../getLatestOpenRankScores";
import { getLatestTipperAirdrop } from "../getLatestTipperAirdrop";
import { getTippersByDate } from "../getTippersByDate";
import { dayUTC } from "../utils/dayUTC";
import { flushCache } from "../utils/flushCache";
import { getTipScores } from "../utils/getTipScores";
import { dbScheduler } from "../utils/helpers";
import { counter } from "./counter";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

type JobData = {
  fid: number;
  from: Date;
  to: Date;
};

new Worker(queueNames.CREATE_TIPPER_SCORES, createTipperScoresBatch, {
  connection: queueConnection,
  concurrency: 5,
});

export async function createTipperScores() {
  console.info(`STARTING: ${queueNames.CREATE_TIPPER_SCORES}`);

  const latestAirdrop = await getLatestTipperAirdrop();

  const from = latestAirdrop ? latestAirdrop.createdAt : SCORE_START_DATE;

  // Recent tips won't have an OpenRank score change yet
  const to = dayUTC().subtract(OPENRANK_SNAPSHOT_INTERVAL, "hours").toDate();

  const tippers = await getTippersByDate({
    from,
    to,
  });

  await counter.init({
    queueName: queueNames.CREATE_TIPPER_SCORES,
    total: tippers.length,
  });

  // Putting the hour in the job name to avoid collisions
  const date = dayjs();
  const day = date.format("YYYY-MM-DD");
  const hour = date.format("hh");

  console.log(
    `${queueNames.CREATE_TIPPER_SCORES}: Creating ${tippers.length}jobs`,
  );

  // Create jobs
  await createTipperScoresQueue.addBulk(
    tippers.map((tipper, i) => {
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
    where: { id: fid },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          tippeeOpenRankScore: {
            not: null,
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

  const tips = tipperData.tipsGiven;

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

  // Return average
  const tipperScore = totalScore.div(tips.length);

  await prisma.tipperScore.create({
    data: {
      userId: fid,
      score: tipperScore.toNumber(),
    },
  });

  await flushCache({
    type: cacheTypes.USER,
    ids: [fid],
  });
}

const queueEvents = new QueueEvents(queueNames.CREATE_TIPPER_SCORES, {
  connection: queueConnection,
});

logQueueEvents({ queueEvents, queueName: queueNames.CREATE_TIPPER_SCORES });

queueEvents.on("completed", async (job) => {
  const { count, total } = await counter.increment(
    queueNames.CREATE_TIPPER_SCORES,
  );

  console.info(`done: ${job.jobId} (${count}/${total}).`);

  if (count === total) {
    await flushCache({
      type: cacheTypes.USER_TIPS,
    });
    await flushCache({
      type: cacheTypes.LEADERBOARD,
    });
    console.info(`ALL DONE: ${queueNames.CREATE_TIPPER_SCORES}`);

    await createTipperScoresQueue.drain();
    await counter.remove(queueNames.CREATE_TIPPER_SCORES);
  }
});
