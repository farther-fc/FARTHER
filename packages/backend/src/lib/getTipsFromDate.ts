import { prisma } from "../prisma";

const SCORE_START_DATE = new Date("2024-07-14T03:00:08.894Z");

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

  const now = new Date();
  const august1 = new Date("2024-08-01T00:00:00.000Z");

  return latestAirdrop
    ? latestAirdrop.createdAt
    : now < august1
      ? SCORE_START_DATE
      : august1;
}
