import { prisma } from "@farther/backend";
import { ACTIVE_TIP_DAYS_REQUIRED } from "@farther/common";
import {
  activeTipDaysRulesStartTime,
  getFilteredTippers,
  getRawLeaderboard,
} from "../utils/getTippersForLeaderboard";

describe("getFilteredTippers", () => {
  let tippers: Awaited<ReturnType<typeof getRawLeaderboard>>;

  // User 1 starts tipping 6 days before the rule goes into effect
  const user1firstTipTime = activeTipDaysRulesStartTime.subtract(6, "day");
  const user1TipCount = 1;

  // User 2 starts tipping three days before the rule goes into effect
  const user2firstTipTime = activeTipDaysRulesStartTime.subtract(3, "day");
  const user2TipCount = 3;

  // User 3 starts tipping an hour after the rule goes into effect
  const user3firstTipTime = activeTipDaysRulesStartTime.add(1, "hour");
  const user3TipCount = ACTIVE_TIP_DAYS_REQUIRED;

  // User 4 starts tipping two days after the rule goes into effect
  const user4firstTipTime = activeTipDaysRulesStartTime.add(2, "day");
  const user4TipCount = ACTIVE_TIP_DAYS_REQUIRED;

  beforeEach(async () => {
    // Clean up existing data
    await prisma.tip.deleteMany({});
    await prisma.tipAllowance.deleteMany({});
    await prisma.user.deleteMany({});

    // Create test users
    for (let i = 1; i <= 4; i++) {
      await prisma.user.create({
        data: {
          id: i,
        },
      });
    }

    for (let day = 0; day < 10; day++) {
      const tipMeta = await prisma.tipMeta.create({
        data: {
          tipMinimum: 1,
          totalAllowance: 100,
          carriedOver: 0,
          usdPrice: 1,
        },
      });

      if (day < user1TipCount) {
        // Only 1 tip for user 1
        const tipAllowance1 = await prisma.tipAllowance.create({
          data: {
            userId: 1,
            amount: 1,
            tipMetaId: tipMeta.id,
            userBalance: "100",
          },
        });

        await prisma.tip.create({
          data: {
            hash: `tip1`,
            tipperId: 1,
            tippeeId: 2,
            tipAllowanceId: tipAllowance1.id,
            amount: 1,
            createdAt: user1firstTipTime.toDate(),
          },
        });
      }

      if (day < user2TipCount) {
        const tipAllowance2 = await prisma.tipAllowance.create({
          data: {
            userId: 2,
            amount: 1,
            tipMetaId: tipMeta.id,
            userBalance: "100",
          },
        });

        await prisma.tip.create({
          data: {
            hash: `tip2-${day}`,
            tipperId: 2,
            tippeeId: 1,
            tipAllowanceId: tipAllowance2.id,
            amount: 1,
            createdAt: user2firstTipTime.add(day, "day").toDate(),
          },
        });
      }

      if (day < user3TipCount) {
        const tipAllowance3 = await prisma.tipAllowance.create({
          data: {
            userId: 3,
            amount: 1,
            tipMetaId: tipMeta.id,
            userBalance: "100",
          },
        });

        await prisma.tip.create({
          data: {
            hash: `tip3-${day}`,
            tipperId: 3,
            tippeeId: 1,
            tipAllowanceId: tipAllowance3.id,
            amount: 1,
            createdAt: user3firstTipTime.add(day, "day").toDate(),
          },
        });
      }

      if (day < user4TipCount) {
        const tipAllowance4 = await prisma.tipAllowance.create({
          data: {
            userId: 4,
            amount: 1,
            tipMetaId: tipMeta.id,
            userBalance: "100",
          },
        });

        await prisma.tip.create({
          data: {
            hash: `tip4-${day}`,
            tipperId: 4,
            tippeeId: 1,
            tipAllowanceId: tipAllowance4.id,
            amount: 1,
            createdAt: user4firstTipTime.add(day, "day").toDate(),
          },
        });
      }
    }
  });

  test("should return correct tippers the moment the rule becomes active", async () => {
    const now = activeTipDaysRulesStartTime;

    tippers = await getRawLeaderboard(now);

    expect(tippers.length).toBe(2);

    const filteredTippers = await getFilteredTippers(tippers, now);

    expect(filteredTippers).toHaveLength(1);
    expect(filteredTippers.map((t) => t.user.id)).toEqual([2]);
  });

  test("should return correct tippers the day after the rule becomes active", async () => {
    const now = activeTipDaysRulesStartTime.add(1, "day");

    tippers = await getRawLeaderboard(now);

    expect(tippers.length).toBe(3);

    const filteredTippers = await getFilteredTippers(tippers, now);

    expect(filteredTippers).toHaveLength(2);

    filteredTippers.forEach((t) => {
      expect([2, 3]).toContain(t.user.id);
    });
  });

  test("should return correct tippers 6 days after the rule becomes active", async () => {
    const now = activeTipDaysRulesStartTime.add(6, "day");

    tippers = await getRawLeaderboard(now);

    expect(tippers.length).toBe(4);

    const filteredTippers = await getFilteredTippers(tippers, now);

    expect(filteredTippers).toHaveLength(2);

    // Only users 3 and 4 tip the total required days
    filteredTippers.forEach((t) => {
      expect([3, 4]).toContain(t.user.id);
    });
  });
});
