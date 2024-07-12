import dayjs from "dayjs";
import { prisma } from "../../prisma";
import {
  acceptedWindowMs,
  getOpenRankScorePair,
} from "../getOpenRankScorePair";
import { mockDate, resetDatabase } from "./testUtils";

describe("getOpenRankScorePair", () => {
  const times = {
    score1: new Date("2024-07-10 01:00:00.000"),
    score2: new Date("2024-07-10 07:00:00.000"),
    score3: new Date("2024-07-10 13:00:00.000"),
    score4: new Date("2024-07-10 19:00:00.000"),
  };

  beforeAll(async () => {
    await resetDatabase();

    // Set time to 1 ms after the latest score
    mockDate(dayjs(times.score4).add(1).toISOString());

    // Seed openrank scores
    const dummyScores = [
      {
        createdAt: times.score1,
        score: 0.001,
      },
      {
        createdAt: times.score2,
        score: 0.002,
      },
      {
        createdAt: times.score3,
        score: 0.003,
      },
      {
        createdAt: times.score4,
        score: 0.004,
      },
    ];

    let snapshotId = 1;
    for (const score of dummyScores) {
      await prisma.openRankScore.create({
        data: {
          user: {
            connectOrCreate: {
              where: {
                id: 1,
              },
              create: {
                id: 1,
              },
            },
          },
          score: score.score,
          createdAt: score.createdAt,
          snapshot: {
            connectOrCreate: {
              where: {
                id: snapshotId.toString(),
              },
              create: {
                id: snapshotId.toString(),
              },
            },
          },
        },
      });

      snapshotId++;
    }
  });

  test("should return the next available openrank score if start time is before first score", async () => {
    const [score1, score2] = await getOpenRankScorePair({
      userId: 1,
      startTime: new Date("2024-07-10 00:30.000"),
      endTime: new Date("2024-07-10 13:30:00.000"),
    });

    expect(score1?.score).toBe(0.001);
    expect(score2?.score).toBe(0.003);
  });

  test(`should return the correct openrank score pair if end time isn't included`, async () => {
    const [score1, score2] = await getOpenRankScorePair({
      userId: 1,
      startTime: new Date("2024-07-10 01:30.000"),
    });

    expect(score1?.score).toBe(0.002);
    expect(score2?.score).toBe(0.004);
  });

  test(`should return null if start score isn't found`, async () => {
    const [score1] = await getOpenRankScorePair({
      userId: 1,
      startTime: new Date("2050-01-01 00:00:00.000"),
    });

    expect(score1).toBeNull();
  });

  test(`should return null if earliest recorded score is past accepted time window`, async () => {
    const [score1] = await getOpenRankScorePair({
      userId: 1,
      startTime: dayjs(times.score1)
        .subtract(acceptedWindowMs + 1)
        .toDate(),
      endTime: new Date("2024-07-10 19:30:00.000"),
    });

    expect(score1).toBeNull();
  });

  test(`should return null if end time is too far past the latest score`, async () => {
    const endTime = dayjs(times.score4)
      .add(acceptedWindowMs + 1)
      .toDate();

    const [, score2] = await getOpenRankScorePair({
      userId: 1,
      startTime: new Date("2024-07-10 01:00:00.000"),
      endTime,
    });
    expect(score2).toBeNull();
  });
});
