import { prisma } from "../prisma";

async function tipRecipientsInvestigation() {
  const tipRecipients = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {},
      },
    },
    select: {
      id: true,
      tipsReceived: {
        where: {
          invalidTipReason: null,
        },
        select: {
          amount: true,
          createdAt: true,
          tipper: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  const topRecipients = tipRecipients
    .map((tr) => ({
      ...tr,
      totalReceived: tr.tipsReceived.reduce((acc, t) => t.amount + acc, 0),
    }))
    .sort((a, b) => {
      return b.totalReceived - a.totalReceived;
    })
    .slice(0, 50);

  console.log(
    topRecipients.map((tr) => {
      return {
        tippeeId: tr.id,
        uniqueTippees: tr.tipsReceived
          .map((t) => t.tipper.id)
          .filter((value, index, self) => self.indexOf(value) === index).length,
        totalRecevied: tr.totalReceived,
        meanPerTipper: tr.totalReceived / tr.tipsReceived.length,
        medianPerTipper: tr.tipsReceived.sort((a, b) => a.amount - b.amount)[
          Math.floor(tr.tipsReceived.length / 2)
        ].amount,
      };
    }),
  );
}

tipRecipientsInvestigation().catch(console.error);
