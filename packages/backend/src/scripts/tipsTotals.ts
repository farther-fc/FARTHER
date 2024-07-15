import { prisma } from "../prisma";

async function tipsTotals() {
  const tipsGiven = await prisma.tip.findMany({
    where: {
      invalidTipReason: null,
    },
  });

  const total = tipsGiven.reduce((total, tip) => {
    return total + tip.amount;
  }, 0);

  console.log("Total tips given", total.toLocaleString());
}

tipsTotals();
