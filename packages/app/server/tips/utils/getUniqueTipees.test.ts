import { prisma } from "@farther/backend";
import { getUniqueTippees } from "./getUniqueTippees";

describe("getUniqueTipees", () => {
  it("returns the unique number of tippees for a given tipper fid", async () => {
    const TIPPER_ID = 0;
    const tippeeIds = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 5, 5, 5, 5];

    await prisma.$transaction(async () => {
      await prisma.user.create({
        data: {
          id: TIPPER_ID,
        },
      });

      const tipAllowance = await prisma.tipAllowance.create({
        data: {
          amount: 100000,
          userId: TIPPER_ID,
          userBalance: "42069",
        },
      });

      for (const tippeeId of tippeeIds) {
        await prisma.tip.create({
          data: {
            hash: `0x${Math.random()}`,
            amount: 1,
            tipper: {
              connect: {
                id: TIPPER_ID,
              },
            },
            tippee: {
              connectOrCreate: {
                where: { id: tippeeId },
                create: { id: tippeeId },
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

    const allTips = await prisma.tip.findMany({
      where: {
        tipperId: TIPPER_ID,
      },
    });

    const uniqueTipees = await getUniqueTippees(TIPPER_ID);

    expect(allTips.length).toBe(14);
    expect(uniqueTipees).toBe(5);
  });
});
