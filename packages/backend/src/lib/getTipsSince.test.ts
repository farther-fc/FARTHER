import { TipAllowance, prisma } from "../prisma";
import { getTipsSince } from "./getTipsSince";

describe("getTipsSince", () => {
  const MAX_MS = 5;
  let tipAllowance: TipAllowance;

  beforeEach(async () => {
    // Ensure the database is clean before each test
    await prisma.tip.deleteMany();

    const tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 12971071,
        carriedOver: 17191,
        usdPrice: 0.0023,
      },
    });

    tipAllowance = await prisma.tipAllowance.create({
      data: {
        userId: 1,
        tipMetaId: tipMeta.id,
        amount: 123,
        userBalance: "123",
      },
    });

    for (let ms = 1; ms <= MAX_MS; ms++) {
      await prisma.tip.create({
        data: {
          createdAt: new Date(`2023-01-01T00:00:00.00${ms}Z`),
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
                id: 1,
              },
              create: {
                id: 1,
              },
            },
          },
          tippee: {
            connectOrCreate: {
              where: {
                id: 2,
              },
              create: {
                id: 2,
              },
            },
          },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return tips created since the given date", async () => {
    const mockDate = new Date("2023-01-01");

    const expectedResult = Array.from({ length: MAX_MS }, (_, i) =>
      expect.objectContaining({
        createdAt: new Date(`2023-01-01T00:00:00.00${i + 1}Z`),
        invalidTipReason: null,
      }),
    );

    const result = await getTipsSince(mockDate);
    expect(result).toEqual(expectedResult);
  });

  it("should return an empty array if no tips are found", async () => {
    const result = await getTipsSince(
      new Date(`2023-01-01T00:00:00.0${MAX_MS + 1}Z`),
    );
    expect(result).toEqual([]);
  });
});
