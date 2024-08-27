import { prisma } from "../prisma";

async function temp() {
  const latestLPAirdrop = await prisma.airdrop.findFirst({
    where: {
      allocations: {
        some: {
          type: "LIQUIDITY",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      allocations: true,
    },
  });

  console.log(latestLPAirdrop?.root, latestLPAirdrop?.allocations.length);
}

temp();
