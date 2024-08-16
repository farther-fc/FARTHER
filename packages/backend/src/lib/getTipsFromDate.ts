import { getStartOfMonthUTC } from "@farther/common";
import { prisma } from "../prisma";

export async function getTipsFromDate() {
  const latestAirdrop = await prisma.airdrop.findFirst({
    where: {
      allocations: {
        some: {
          type: "TIPPER",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  return latestAirdrop ? latestAirdrop.createdAt : getStartOfMonthUTC(0);
}
