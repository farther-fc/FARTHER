import { writeFile } from "fs/promises";
import { prisma } from "../prisma";

async function mostConsistentTippers() {
  const amounts = await prisma.tip.groupBy({
    by: ["tipperId"],
    where: {
      invalidTipReason: null,
    },
    _sum: {
      amount: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: amounts.map((amount) => amount.tipperId),
      },
    },
    select: {
      id: true,
      username: true,
    },
  });

  const tipAmounts = amounts
    .map((amount) => ({
      fid: amount.tipperId,
      username: users.find((user) => user.id === amount.tipperId)?.username,
      amount: amount._sum.amount ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  writeFile(
    `./mostConsistentTippers.json`,
    JSON.stringify(tipAmounts, null, 2),
  );
}

mostConsistentTippers();
