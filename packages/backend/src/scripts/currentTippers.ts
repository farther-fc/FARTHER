import { WAD_SCALER } from "@farther/common";
import { prisma } from "../prisma";

async function currentTippers() {
  const latestTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  if (!latestTipMeta) {
    throw new Error("No tip meta found");
  }

  const allowances = await prisma.tipAllowance.findMany({
    where: {
      createdAt: {
        gte: latestTipMeta.createdAt,
      },
    },
    select: {
      userId: true,
      userBalance: true,
    },
  });

  console.log(
    allowances.map((a) => ({
      fid: a.userId,
      balance: (BigInt(a.userBalance) / WAD_SCALER).toLocaleString(),
    })),
  );
  console.log(allowances.length);
}

currentTippers();
