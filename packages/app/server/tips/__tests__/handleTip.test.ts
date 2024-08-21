import {
  InvalidTipReason,
  TipMeta,
  clearDatabase,
  prisma,
} from "@farther/backend";
import {
  TIPPEE_WEEKLY_THRESHOLD_RATIO,
  TIP_MINIMUM,
  dayUTC,
} from "@farther/common";
import { v4 as uuidv4 } from "uuid";
import { createDummyCast } from "../agentModeling/createDummyCast";
import {
  getExceededThresholdToTippee,
  getExceededThresholdToTippers,
  processTip,
} from "../processTip";
import { getWeekAllowancesAndTips } from "../utils/getWeekAllowancesAndTips";

const DAILY_ALLOWANCE = 1000;
const WEEKLY_ALLOWANCE = DAILY_ALLOWANCE * 7;

describe("handleTip", () => {
  afterAll(async () => {
    await clearDatabase();
  });

  let tipMeta: TipMeta;

  beforeEach(async () => {
    await clearDatabase();

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

    tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });
  });

  it("creates valid tip if the tip amount is equal to the tip minimum", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: 10000000,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 2,
        amount: TIP_MINIMUM,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBeNull();
  });

  it("creates invalid tip if the tip amount is less than the tip minimum", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 2,
        amount: TIP_MINIMUM - 1,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.BELOW_MINIMUM);
  });

  it("creates invalid tip if tipper has insufficient allowance", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 2,
        amount: DAILY_ALLOWANCE + 1,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.INSUFFICIENT_ALLOWANCE);
  });

  it("creates invalid tip if the tipper is self-tipping", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 1,
        amount: DAILY_ALLOWANCE,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.SELF_TIPPING);
  });

  it("creates invalid tip if the tipper is self-tipping", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 1,
        amount: DAILY_ALLOWANCE,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.SELF_TIPPING);
  });

  it("creates invalid tip if the tipper is banned", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    await prisma.user.update({
      where: {
        id: 1,
      },
      data: {
        isBanned: true,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 2,
        amount: DAILY_ALLOWANCE,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.BANNED_TIPPER);
  });

  it("creates invalid tip if the tippee is banned", async () => {
    await prisma.tipAllowance.create({
      data: {
        id: uuidv4(),
        userId: 1,
        amount: DAILY_ALLOWANCE,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    await prisma.user.update({
      where: {
        id: 2,
      },
      data: {
        isBanned: true,
      },
    });

    const tip = await processTip({
      castData: createDummyCast({
        tipperFid: 1,
        tippeeFid: 2,
        amount: DAILY_ALLOWANCE,
      }).data as any,
      createdAtMs: Date.now(),
    });

    expect(tip?.invalidTipReason).toBe(InvalidTipReason.BANNED_TIPPEE);
  });
});

describe("getExceededThresholdToTippee", () => {
  afterAll(async () => {
    await clearDatabase();
  });

  let tipMeta: TipMeta;

  beforeEach(async () => {
    await clearDatabase();

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

    tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });
  });

  it("returns true if the tipper has exceeded the threshold to the tippee", async () => {
    const tipAmount = DAILY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO;
    const days = 6;
    for (let i = 0; i < days; i++) {
      const allowance = await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          createdAt: dayUTC(Date.now()).subtract(i, "day").toDate(),
          amount: tipAmount,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: allowance.id,
        },
      });
    }

    const allowances = await getWeekAllowancesAndTips({
      tipperId: 1,
    });

    const tipsThisWeek = allowances.flatMap((a) => a.tips);

    const result = await getExceededThresholdToTippee({
      tipsThisWeek,
      tippeeFid: 2,
      weekAllowancesTotal: WEEKLY_ALLOWANCE,
      currentAmount: tipAmount + 1,
    });

    expect(result.exceededThresholdToTippee).toBe(true);
    expect(result.validAmount).toBe(
      WEEKLY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO - tipAmount * days,
    );
  });

  it("returns false if the tipper has not exceeded the threshold to the tippee", async () => {
    const tipAmount = DAILY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO;
    const days = 6;
    for (let i = 0; i < days; i++) {
      const allowance = await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          createdAt: dayUTC(Date.now()).subtract(i, "day").toDate(),
          amount: tipAmount,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: allowance.id,
        },
      });
    }

    const allowances = await getWeekAllowancesAndTips({
      tipperId: 1,
    });

    const tipsThisWeek = allowances.flatMap((a) => a.tips);

    const result = await getExceededThresholdToTippee({
      tipsThisWeek,
      tippeeFid: 2,
      weekAllowancesTotal: WEEKLY_ALLOWANCE,
      currentAmount: tipAmount,
    });

    expect(result.exceededThresholdToTippee).toBe(false);
    expect(result.validAmount).toBe(
      WEEKLY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO - tipAmount * days,
    );
  });
});

describe("getExceededThresholdToTippers", () => {
  let tipMeta: TipMeta;

  beforeEach(async () => {
    await clearDatabase();

    await prisma.user.createMany({
      data: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          // Not a tipper
          id: 3,
        },
      ],
    });

    tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });
  });

  afterAll(async () => {
    await clearDatabase();
  });

  it("returns true if the tipper has exceeded the threshold to other tippers", async () => {
    const tipAmount = DAILY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO;
    const days = 6;
    for (let i = 0; i < days; i++) {
      const tipper1Allowance = await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      // Tipper 2 allowance
      await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 2,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          createdAt: dayUTC(Date.now()).subtract(i, "day").toDate(),
          amount: tipAmount,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: tipper1Allowance.id,
        },
      });
    }

    const allowances = await getWeekAllowancesAndTips({
      tipperId: 1,
    });

    const tipsThisWeek = allowances.flatMap((a) => a.tips);

    const result = await getExceededThresholdToTippers({
      tipsThisWeek,
      weekAllowancesTotal: WEEKLY_ALLOWANCE,
      currentAmount: tipAmount + 1,
      tippeeFid: 2,
    });

    expect(result.exceededThresholdToTippers).toBe(true);
    expect(result.validAmount).toBe(
      WEEKLY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO - tipAmount * days,
    );
  });

  it("returns false if the tipper has not exceeded the threshold to other tippers", async () => {
    const tipAmount = DAILY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO;
    const days = 6;
    for (let i = 0; i < days; i++) {
      const tipper1Allowance = await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      // Tipper 2 allowance
      await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 2,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          createdAt: dayUTC(Date.now()).subtract(i, "day").toDate(),
          amount: tipAmount,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: tipper1Allowance.id,
        },
      });
    }

    const allowances = await getWeekAllowancesAndTips({
      tipperId: 1,
    });

    const tipsThisWeek = allowances.flatMap((a) => a.tips);

    const result = await getExceededThresholdToTippers({
      tipsThisWeek,
      weekAllowancesTotal: WEEKLY_ALLOWANCE,
      currentAmount: tipAmount,
      tippeeFid: 2,
    });

    expect(result.exceededThresholdToTippers).toBe(false);
    expect(result.validAmount).toBe(
      WEEKLY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO - tipAmount * days,
    );
  });

  it("is false if the tippee is not a tipper", async () => {
    const tipAmount = DAILY_ALLOWANCE * TIPPEE_WEEKLY_THRESHOLD_RATIO;
    const days = 6;
    for (let i = 0; i < days; i++) {
      const tipper1Allowance = await prisma.tipAllowance.create({
        data: {
          id: uuidv4(),
          userId: 1,
          amount: DAILY_ALLOWANCE,
          userBalance: "123",
          tipMetaId: tipMeta.id,
        },
      });

      await prisma.tip.create({
        data: {
          hash: Math.random().toString(),
          createdAt: dayUTC(Date.now()).subtract(i, "day").toDate(),
          amount: tipAmount,
          tipperId: 1,
          tippeeId: 3,
          tipAllowanceId: tipper1Allowance.id,
        },
      });
    }

    const allowances = await getWeekAllowancesAndTips({
      tipperId: 1,
    });

    const tipsThisWeek = allowances.flatMap((a) => a.tips);

    const result = await getExceededThresholdToTippers({
      tipsThisWeek,
      weekAllowancesTotal: WEEKLY_ALLOWANCE,
      currentAmount: tipAmount,
      tippeeFid: 2,
    });

    expect(result.exceededThresholdToTippers).toBe(false);
  });
});
