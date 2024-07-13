import { prisma } from "../prisma";

async function investigateTippers() {
  const tippers = await prisma.user.findMany({
    where: {
      tipsGiven: {
        some: {
          invalidTipReason: null,
        },
      },
    },
    select: {
      id: true,
      tipsGiven: {
        where: {
          invalidTipReason: null,
        },
      },
    },
  });

  const filteredTippers = tippers.filter(
    (tipper) => tipper.tipsGiven.length > 20,
  );

  const sortedByTokensPerRecipient = filteredTippers
    .map((tipper) => {
      const uniqueRecipients = new Set(
        tipper.tipsGiven.map((tip) => tip.tippeeId),
      );
      const totalTipAmount = tipper.tipsGiven
        .map((tip) => tip.amount)
        .reduce((acc, curr) => acc + curr, 0);
      return {
        userId: tipper.id,
        uniqueRecipients: uniqueRecipients.size,
        totalTipAmount,
        tipsGiven: tipper.tipsGiven.length,
        tokensPerRecipient: totalTipAmount / uniqueRecipients.size,
      };
    })
    .sort((a, b) => a.tokensPerRecipient - b.tokensPerRecipient);

  const sortedByUniqueRecipients = sortedByTokensPerRecipient.sort(
    (a, b) => b.uniqueRecipients - a.uniqueRecipients,
  );

  const medianUniqueRecipients =
    sortedByUniqueRecipients[Math.floor(sortedByUniqueRecipients.length / 2)]
      .uniqueRecipients;

  const medianTokensPerRecipient = sortedByUniqueRecipients
    .map((tipper) => tipper.tokensPerRecipient)
    .sort((a, b) => a - b)[Math.floor(sortedByUniqueRecipients.length / 2)];

  console.log(
    "Top 10 tippers by tokens per recipient:",
    sortedByTokensPerRecipient.slice(0, 10).map((tipper) => ({
      userId: tipper.userId,
      tokensPerRecipient: tipper.tokensPerRecipient,
      tips: tipper.tipsGiven,
    })),
  );
  console.log(
    "Bottom 10 tippers by tokens per recipient:",
    sortedByTokensPerRecipient.slice(-10).map((tipper) => ({
      userId: tipper.userId,
      tokensPerRecipient: tipper.tokensPerRecipient,
      tips: tipper.tipsGiven,
    })),
  );
  console.log(
    "Top 10 tippers by unique recipients:",
    sortedByUniqueRecipients.slice(0, 10).map((tipper) => ({
      userId: tipper.userId,
      uniqueRecipients: tipper.uniqueRecipients,
      tips: tipper.tipsGiven,
    })),
  );
  console.log(
    "Bottom 10 tippers by unique recipients:",
    sortedByUniqueRecipients.slice(-10).map((tipper) => ({
      userId: tipper.userId,
      uniqueRecipients: tipper.uniqueRecipients,
      tips: tipper.tipsGiven,
    })),
  );
  console.log("medianUniqueRecipients", medianUniqueRecipients);
  console.log("medianTokensPerRecipient", medianTokensPerRecipient);
}

investigateTippers();
