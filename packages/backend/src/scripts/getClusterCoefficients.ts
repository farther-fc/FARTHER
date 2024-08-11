import { dayUTC, getAllClusterCoefficients } from "@farther/common";
import { writeFile } from "fs/promises";
import { prisma } from "../prisma";

async function getClusterCoefficients() {
  const now = dayUTC();

  const rawTips = await prisma.tip.findMany({
    // orderBy: {
    //   createdAt: "desc",
    // },
  });

  const tips = rawTips.map((tip) => ({
    tipperId: tip.tipperId,
    tippeeId: tip.tippeeId,
  }));

  const clusterCoefficients = getAllClusterCoefficients({
    tips,
    minTips: 3,
  }).sort((b, a) => b.clusterCoef - a.clusterCoef);

  writeFile(
    "clusterCoefficients.json",
    JSON.stringify(clusterCoefficients, null, 2),
  );

  const secondsTaken = dayUTC().diff(now, "seconds");

  console.log(
    `Calculated cluster coefficients for ${clusterCoefficients.length} users in ${secondsTaken} seconds`,
  );
}

getClusterCoefficients();
