import { OPENRANK_SNAPSHOT_INTERVAL } from "@farther/common";
import dayjs from "dayjs";
import { prisma } from "../prisma";

// Allow for a 1 hour buffer in case the snapshot is delayed
export const acceptedWindowMs =
  (OPENRANK_SNAPSHOT_INTERVAL + 1) * 60 * 60 * 1000;

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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  if (!startScore) {
    throw new Error("No start score found");
  }

  if (!endScore) {
    throw new Error("No end score found");
  }

  if (dayjs(startScore.createdAt).diff(dayjs(startTime)) > acceptedWindowMs) {
    throw new Error("No score found within accepted interval for startTime");
  }

  if (dayjs(endTime).diff(dayjs(endScore.createdAt)) > acceptedWindowMs) {
    throw new Error("No score found within accepted interval for endTime");
  }

  return [startScore, endScore];
}
