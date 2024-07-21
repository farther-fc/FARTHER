import { clearDatabase, prisma } from "@farther/backend";
import dayjs from "dayjs";
import { publicTipsByTipper } from "../utils/publicTipsByTipper";

const TIP_COUNT = 200;
const TIPPER_ID = 137093;
const FIRST_TIP_TIMESTAMP = dayjs("2021-01-01");

beforeAll(async () => {
  await clearDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  const tipMeta = await prisma.tipMeta.create({
    data: {
      tipMinimum: 123,
      totalAllowance: 123,
      carriedOver: 123,
      usdPrice: 123,
    },
  });

  await prisma.user.create({
    data: {
      id: TIPPER_ID,
    },
  });

  // Give the tipper a tip allowance
  const tipAllowance = await prisma.tipAllowance.create({
    data: {
      amount: 30239739073,
      userId: TIPPER_ID,
      userBalance: "42069",
      tipMetaId: tipMeta.id,
    },
  });

  // Create tips
  for (let i = 0; i < TIP_COUNT; i++) {
    await prisma.tip.create({
      data: {
        hash: `0x${Math.random()}`,
        createdAt: FIRST_TIP_TIMESTAMP.add(i).toDate(),
        amount: 1,
        tipper: {
          connect: {
            id: TIPPER_ID,
          },
        },
        tippee: {
          connectOrCreate: {
            where: { id: 123 },
            create: { id: 123 },
          },
        },
        tipAllowance: {
          connect: {
            id: tipAllowance.id,
          },
        },
      },
    });
  }
});

describe("publicTipsByTipper", () => {
  it("should only return the 100 latest tips in descending order if no params are provided", async () => {
    const result = await publicTipsByTipper({ tipperId: TIPPER_ID });
    expect(result.tips).toHaveLength(100);
    expect(result.nextCursor).not.toBeNull();
    expect(new Date(result.tips[0].createdAt).getTime()).toBe(
      FIRST_TIP_TIMESTAMP.add(TIP_COUNT - 1)
        .toDate()
        .getTime(),
    );
  });

  it("should return tips in ascending order when specified", async () => {
    const result = await publicTipsByTipper({
      tipperId: TIPPER_ID,
      order: "asc",
    });
    expect(result.tips).toHaveLength(100);
    expect(new Date(result.tips[0].createdAt).getTime()).toBe(
      FIRST_TIP_TIMESTAMP.valueOf(),
    );
    expect(
      new Date(result.tips[result.tips.length - 1].createdAt).getTime(),
    ).toBeGreaterThan(FIRST_TIP_TIMESTAMP.valueOf());
  });

  it("should respect the limit parameter", async () => {
    const result = await publicTipsByTipper({
      tipperId: TIPPER_ID,
      limit: 50,
    });
    expect(result.tips).toHaveLength(50);
    expect(result.nextCursor).not.toBeNull();

    // Subsequent calls should return the next batch
    const secondResult = await publicTipsByTipper({
      tipperId: TIPPER_ID,
      cursor: result.nextCursor,
      limit: 50,
    });

    expect(secondResult.tips).toHaveLength(50);

    // Make sure there are no duplicate timestamps with first batch
    const allTimeStamps = new Set([
      ...result.tips.map((tip) => new Date(tip.createdAt).getTime()),
      ...secondResult.tips.map((tip) => new Date(tip.createdAt).getTime()),
    ]);
    expect(allTimeStamps.size).toBe(100);
  });

  it("should respect the 'from' field when in descending order", async () => {
    const result = await publicTipsByTipper({
      tipperId: TIPPER_ID,
      from: FIRST_TIP_TIMESTAMP.add(50).valueOf(),
    });
    expect(result.tips.length).toBe(51);
    expect(result.nextCursor).not.toBeNull();
    expect(new Date(result.tips[0].createdAt).getTime()).toBe(
      FIRST_TIP_TIMESTAMP.add(50).valueOf(),
    );
    expect(
      new Date(result.tips[result.tips.length - 1].createdAt).getTime(),
    ).toBe(FIRST_TIP_TIMESTAMP.valueOf());
  });

  it("should respect the 'from' field when in ascending order", async () => {
    const result = await publicTipsByTipper({
      tipperId: TIPPER_ID,
      order: "asc",
      from: FIRST_TIP_TIMESTAMP.add(50).valueOf(),
    });
    expect(result.tips.length).toBe(100);
    expect(result.nextCursor).not.toBeNull();
    expect(new Date(result.tips[0].createdAt).getTime()).toBe(
      FIRST_TIP_TIMESTAMP.add(50).valueOf(),
    );
    expect(
      new Date(result.tips[result.tips.length - 1].createdAt).getTime(),
    ).toBe(FIRST_TIP_TIMESTAMP.add(149).valueOf());
  });

  it("should return an empty array if no tips are found", async () => {
    const result = await publicTipsByTipper({ tipperId: 3 });
    expect(result.tips).toHaveLength(0);
    expect(result.nextCursor).toBeNull();
  });
});
