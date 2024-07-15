import { prisma } from "../prisma";

export async function getLatestTipperAirdrop() {
  return await prisma.airdrop.findFirst({
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
}
