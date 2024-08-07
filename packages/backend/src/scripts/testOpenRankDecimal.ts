import { OPENRANK_ENGAGEMENT_URL, axios } from "@farther/common";
import Decimal from "decimal.js";
import { prisma } from "../prisma";

async function testOpenRankDecimal() {
  const response = await axios.post(OPENRANK_ENGAGEMENT_URL, [4378]);

  const score = response.data.result[0].score;

  const openRankScore = await prisma.openRankScore.create({
    data: {
      snapshot: {
        connectOrCreate: {
          where: {
            id: "1",
          },
          create: {
            id: "1",
          },
        },
      },
      user: {
        connectOrCreate: {
          where: {
            id: 4378,
          },
          create: {
            id: 4378,
          },
        },
      },
      score: score,
      scoreNew: new Decimal(score),
    },
  });

  console.log(score, openRankScore);
}

testOpenRankDecimal();
