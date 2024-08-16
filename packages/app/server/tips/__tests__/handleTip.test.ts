import { clearDatabase, prisma } from "@farther/backend";
import { getExceededThresholdToTippee } from "server/tips/handleTip";

const DAILY_ALLOWANCE = 1000;

describe("getExceededThresholdToTippee", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {
    await prisma.user.createMany({
      data: [
        {
          id: 1,
        },
        {
          id: 2,
        },
      ],
    });

    const tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });

    for (let i = 0; i < 7; i++) {
      const allowance = await prisma.tipAllowance.create({
        data: {
          id: `allowance-${i}`,
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          amount: 123,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: allowance.id,
        },
      });
    }
  });

  it("returns true if the tipper has exceeded the threshold to the tippee", async () => {
    const result = await getExceededThresholdToTippee({
      // tips:
      tippeeFid: 2,
      currentAmount: 15001,
    });

    expect(result).toBe(true);
  });
});

describe("getExceededThresholdToTippers", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  beforeEach(async () => {});
});
