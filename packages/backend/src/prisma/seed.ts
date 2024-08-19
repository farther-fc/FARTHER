import { TIP_MINIMUM, cronSchedules } from "@farther/common";
import { prisma } from ".";
import { getLatestCronTime } from "../lib/getLatestCronTime";

import { v4 as uuidv4 } from "uuid";

const USERS = [
  {
    id: 3,
    username: "dwr.eth",
    address: "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
    pfpUrl:
      "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
    openRankScore: 0.0183428395539522,
    tipAllowanceId: undefined,
    tips: [],
  },
  {
    id: 4378,
    username: "gigamesh",
    address: "0x795050decc0322567c4f0098209d4edc5a69b9d0",
    pfpUrl: "https://i.imgur.com/3hrPNK8.jpg",
    openRankScore: 0.000331582617945969,
    tipAllowanceId: uuidv4(),
    tips: [
      { tippeeId: 3, amount: 200, tippeeOpenRankScore: 7.35098453219507e-8 },
      {
        tippeeId: 429188,
        amount: 1000,
        tippeeOpenRankScore: 7.35098453219507e-8,
      },
    ],
  },
  {
    id: 429188,
    username: "farther",
    address: "0x97e3b75b2eebcc722b504851416e1410b32180a3",
    pfpUrl:
      "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/54e5fe29-73b3-4bb9-da86-4149dcfeac00/original",
    openRankScore: 0.0000329737413267139,
    tipAllowanceId: uuidv4(),
    tips: [
      { tippeeId: 3, amount: 250, tippeeOpenRankScore: 0.0000388845910492819 },
      {
        tippeeId: 4378,
        amount: 800,
        tippeeOpenRankScore: 0.0000388845910492819,
      },
    ],
  },
] as const;

const TOTAL_ALLOWANCE = 999999;

async function seed() {
  const tipMeta = await prisma.tipMeta.create({
    data: {
      tipMinimum: TIP_MINIMUM,
      totalAllowance: TOTAL_ALLOWANCE,
      carriedOver: 0,
      usdPrice: 1,
    },
  });

  const snapshotTimeId = getLatestCronTime(cronSchedules.TIPPEE_OPENRANK_SYNC);

  for (const user of USERS) {
    const tipAllowances = {
      create: {
        id: user.tipAllowanceId,
        tipMetaId: tipMeta.id,
        amount: TOTAL_ALLOWANCE / 3,
        userBalance: "1000000000",
      },
    } as const;

    await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        pfpUrl: user.pfpUrl,
        tipAllowances: user.tipAllowanceId ? tipAllowances : undefined,
        openRankScores: {
          create: {
            snapshot: {
              connectOrCreate: {
                where: {
                  id: snapshotTimeId,
                },
                create: {
                  id: snapshotTimeId,
                },
              },
            },
            score: user.openRankScore,
          },
        },
      },
    });

    await prisma.ethAccount.upsert({
      where: {
        address: user.address,
      },
      update: {},
      create: {
        address: user.address,
      },
    });

    await prisma.userEthAccount.upsert({
      where: {
        userId_ethAccountId: {
          userId: user.id,
          ethAccountId: user.address,
        },
      },
      update: {},
      create: {
        userId: user.id,
        ethAccountId: user.address,
      },
    });
  }

  for (const user of USERS) {
    if (!user.tipAllowanceId) continue;

    await prisma.tip.createMany({
      data: user.tips.map((tip) => ({
        hash: uuidv4(),
        amount: tip.amount,
        tipperId: user.id,
        tippeeId: tip.tippeeId,
        tipAllowanceId: user.tipAllowanceId,
        tippeeOpenRankScore: tip.tippeeOpenRankScore,
      })),
    });
  }
}

seed();
