import { OPENRANK_SNAPSHOT_INTERVAL } from "@farther/common";
import dayjs from "dayjs";
import { prisma } from "../prisma";

// Allow for a 1 hour buffer in case the snapshot is delayed
export const acceptedWindowMs =
  (OPENRANK_SNAPSHOT_INTERVAL + 1) * 60 * 60 * 1000;

export const acceptedLookBackDate = dayjs().subtract(acceptedWindowMs).toDate();

/**
 * Get the openrank score pair for a user at the given time range
 * Returns null if no score is found (assumes the openrank score data is complete)
 */
export async function getOpenRankScorePair({
  userId,
  startTime,
  endTime = new Date(),
}: {
  userId: number;
  startTime: Date;
  endTime?: Date;
}) {
  const [startScore, endScore] = await prisma.$transaction([
    prisma.openRankScore.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startTime,
          lt: dayjs(startTime).add(acceptedWindowMs, "ms").toDate(),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.openRankScore.findFirst({
      where: {
        userId,
        createdAt: {
          lt: endTime,
          gte: dayjs(endTime).subtract(acceptedWindowMs, "ms").toDate(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return [startScore, endScore];
}
