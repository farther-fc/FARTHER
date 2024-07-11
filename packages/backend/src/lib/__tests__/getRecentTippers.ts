import { prisma } from "../../prisma";
import { getRecentTippers } from "../getRecentTippers";
import { resetDatabase } from "./testUtils";

describe("getRecentTippers", () => {
  const SEASON_1_TIPPER_ID = 1;
  const SEASON_2_TIPPER_ID = 2;
  const SEASON_1_START = new Date("2023-01-01T00:00:00.000Z");
  const SEASON_2_START = new Date("2023-02-01T00:00:00.000Z");

  const MAX_MS = 5;

  beforeEach(async () => {
    await resetDatabase();

    await createTips({
      tipperId: SEASON_1_TIPPER_ID,
      seasonStart: SEASON_1_START,
    });

    // Mocks the start of season 2
    await prisma.airdrop.create({
      data: {
        createdAt: SEASON_2_START,
        chainId: 123,
        root: `0x123`,
        amount: "123",
        startTime: new Date(), // irrelevant for the tests
        endTime: new Date(), // irrelevant for the tests
        allocations: {
          create: [
            {
              id: `alloc${SEASON_2_TIPPER_ID}`,
              type: "TIPPER",
              amount: "123",
              user: {
                connectOrCreate: {
                  where: {
                    id: SEASON_2_TIPPER_ID,
                  },
                  create: {
                    id: SEASON_2_TIPPER_ID,
                  },
                },
              },
            },
          ],
        },
      },
    });

    await createTips({
      tipperId: SEASON_2_TIPPER_ID,
      seasonStart: SEASON_2_START,
    });
  });

  it("should return tippers since latest airdrop", async () => {
    const expectedResult = Array.from({ length: MAX_MS }, (_, i) =>
      expect.objectContaining({
        createdAt: new Date(`2023-02-01T00:00:00.00${i + 1}Z`),
        invalidTipReason: null,
      }),
    );

    const seasonTippers = await getRecentTippers(SEASON_2_START);

    console.log("all tips", await prisma.tip.findMany());

    expect(seasonTippers).toHaveLength(1);
    expect(seasonTippers[0].id).toEqual(SEASON_2_TIPPER_ID);

    const tips = seasonTippers.flatMap((tipper) => tipper.tipsGiven);

    expect(tips).toEqual(expectedResult);
  });

  it("should return an empty array if no tips are found", async () => {
    await resetDatabase();

    const result = await getRecentTippers(SEASON_2_START);
    expect(result).toEqual([]);
  });

  async function createTips({
    tipperId,
    seasonStart,
  }: {
    tipperId;
    seasonStart: Date;
  }) {
    const tipMeta = await prisma.tipMeta.create({
      data: {
        createdAt: seasonStart,
        tipMinimum: 123,
        totalAllowance: 12971071,
        carriedOver: 17191,
        usdPrice: 0.0023,
      },
    });

    const tipAllowance = await prisma.tipAllowance.create({
      data: {
        user: {
          connectOrCreate: {
            where: {
              id: tipperId,
            },
            create: {
              id: tipperId,
            },
          },
        },
        amount: 123,
        userBalance: "123",
        tipMeta: {
          connect: {
            id: tipMeta.id,
          },
        },
      },
    });

    for (let ms = 1; ms <= MAX_MS; ms++) {
      await prisma.tip.create({
        data: {
          createdAt: new Date(seasonStart.getTime() + ms),
          invalidTipReason: null,
          hash: `0x${Math.random().toString()}`,
          amount: 123,
          tipAllowance: {
            connect: {
              id: tipAllowance.id,
            },
          },
          tipper: {
            connectOrCreate: {
              where: {
                id: tipperId,
              },
              create: {
                id: tipperId,
              },
            },
          },
          tippee: {
            connectOrCreate: {
              where: {
                id: 420,
              },
              create: {
                id: 420,
              },
            },
          },
        },
      });
    }
  }
});
