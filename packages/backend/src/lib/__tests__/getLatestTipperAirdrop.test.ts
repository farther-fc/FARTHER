import { AllocationType, prisma } from "../../prisma";
import { getLatestTipperAirdrop } from "../getLatestTipperAirdrop";
import { clearDatabase } from "../testUtils";

describe("getLatestTipperAirdrop", () => {
  const AIRDROP_COUNT = 3;

  beforeEach(async () => {
    await clearDatabase();
    const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Create dummy users
    await prisma.user.createMany({
      data: userIds.map((id) => ({
        id,
      })),
    });

    for (let i = 0; i < AIRDROP_COUNT; i++) {
      // Create tipper reward allocations
      const allocations = await prisma.(
        userIds.map((id) =>
          prisma.allocation.create({
            data: {
              id: Math.random().toString(),
              userId: id,
              type: "TIPPER" as AllocationType,
              amount: "100",
            },
          }),
        ),
      );

      // Create airdrop
      await prisma.airdrop.create({
        data: {
          allocations: {
            connect: allocations.map((allocation) => ({
              id: allocation.id,
            })),
          },
          chainId: 123,
          amount: "1000",
          startTime: new Date(),
          endTime: new Date(),
          root: `0x${Math.random().toString()}`,
        },
      });
    }
  });

  test("should return the latest tipper airdrop", async () => {
    const allTipperAirdrops = await prisma.airdrop.findMany();

    const latestTipperAirdrop = await getLatestTipperAirdrop();

    // Sort by creation date
    const allAirdrops = allTipperAirdrops.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    expect(allTipperAirdrops.length).toEqual(AIRDROP_COUNT);
    expect(latestTipperAirdrop?.createdAt).toEqual(allAirdrops[0].createdAt);
  });
});
