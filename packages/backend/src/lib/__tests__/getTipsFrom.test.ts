import { CHAIN_ID } from "@farther/common";
import { prisma } from "../../prisma";
import { getTipsFromDate } from "../getTipsFromDate";

describe("getTipsFromDate", () => {
  beforeAll(async () => {
    // Set up test database connection, if not done globally
  });

  beforeEach(async () => {
    await prisma.airdrop.deleteMany();
  });

  afterAll(async () => {
    // Close the database connection if necessary
    await prisma.$disconnect();
  });

  test("returns latest airdrop date if it exists", async () => {
    const date = new Date();

    await prisma.airdrop.create({
      data: {
        createdAt: date,
        chainId: CHAIN_ID,
        amount: "1000",
        root: "0x0",
        startTime: date,
        endTime: date,
        allocations: {
          connectOrCreate: {
            where: {
              id: "alloc1",
            },
            create: {
              id: "alloc1",
              amount: "1000",
              type: "TIPPER",
              user: {
                connectOrCreate: {
                  where: {
                    id: 123,
                  },
                  create: {
                    id: 123,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = await getTipsFromDate();

    expect(result).toEqual(date);
  });

  test("returns SCORE_START_DATE if no airdrop and current date is before August 1st", async () => {
    // Clean up to simulate no airdrop data
    await prisma.airdrop.deleteMany();

    const result = await getTipsFromDate();
    expect(result).toEqual(new Date("2024-07-14T03:00:08.894Z"));
  });

  test("returns August 1st if no airdrop and current date is after July 31st", async () => {
    // Clean up to simulate no airdrop data
    await prisma.airdrop.deleteMany();

    // Mock Date to return a date after July 31st
    jest.useFakeTimers().setSystemTime(new Date("2024-08-02T00:00:00.000Z"));

    const result = await getTipsFromDate();
    expect(result).toEqual(new Date("2024-08-01T00:00:00.000Z"));

    // Restore original Date behavior
    jest.useRealTimers();
  });
});
