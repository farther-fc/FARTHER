import {
  DAILY_USD_TOTAL_ALLOWANCE,
  DistributeAllowancesError,
  TIP_MINIMUM,
  cacheTypes,
  getHoursAgo,
  getOpenRankScores,
  isProduction,
} from "@farther/common";
import { scaleLinear } from "d3";
import { prisma } from "../prisma";
import { getEligibleTippers } from "./getEligibleTippers";
import { getPrevUnusedAllowance } from "./getPrevUnusedAllowance";
import { flushCache } from "./utils/flushCache";
import { getPrice } from "./utils/getPrice";

const NEW_TIPPER_MULTIPLIER = 0.8;

export async function distributeAllowances() {
  console.info("STARTING: distributeAllowances");

  const latestTipMeta = await getLatestTipMeta();

  // Using dayjs, verify that the previous distribution was over 23 hours ago
  if (isProduction) {
    const hoursSinceLastDistribution = getHoursAgo(latestTipMeta.createdAt);

    if (hoursSinceLastDistribution < 23) {
      throw new DistributeAllowancesError({
        message: `Last distribution was less than 23 hours ago`,
      });
    }
  }

  const fartherUsdPrice = await getPrice();

  const baseTotalAllowance = DAILY_USD_TOTAL_ALLOWANCE / fartherUsdPrice;

  const prevUnusedAllowance = await getPrevUnusedAllowance();

  const availableTotalAllowance = baseTotalAllowance + prevUnusedAllowance;

  // Eligible tippers for new tip cycle
  const eligibleTippers = await getEligibleTippers();

  const maxAllowancePerTipper = Math.floor(
    availableTotalAllowance / eligibleTippers.length,
  );

  const sortedBreadthRatios = eligibleTippers
    .map((t) => t.breadthRatio)
    .filter((breadthRatio): breadthRatio is number => breadthRatio !== null)
    .sort((a, b) => a - b);

  const minBreadthRatio = sortedBreadthRatios[0];
  const maxBreadthRatio = sortedBreadthRatios[sortedBreadthRatios.length - 1];

  const getAllowance = scaleLinear()
    .domain([minBreadthRatio, maxBreadthRatio])
    .range([TIP_MINIMUM * 3, maxAllowancePerTipper]);

  const orFollowingRanks = (
    await getOpenRankScores({
      fids: eligibleTippers.map((t) => t.id),
      type: "FOLLOWING",
    })
  ).sort((a, b) => a.rank - b.rank);

  const orFollowingRanksMap = new Map(orFollowingRanks.map((r) => [r.fid, r]));

  const bestRank = orFollowingRanks[0].rank;
  const worstRank = orFollowingRanks[orFollowingRanks.length - 1].rank;

  const openRankAdjustment = scaleLinear()
    .domain([worstRank, bestRank])
    .range([0.75, 1.25]);

  const newAllowances = eligibleTippers.map((tipper) => {
    let amount =
      tipper.breadthRatio === null
        ? maxAllowancePerTipper * NEW_TIPPER_MULTIPLIER
        : getAllowance(tipper.breadthRatio);

    const tipperRank = orFollowingRanksMap.get(tipper.id)?.rank;

    if (tipperRank) {
      amount = amount * openRankAdjustment(tipperRank);
    }

    return {
      userId: tipper.id,
      amount,
      breadthRatio: tipper.breadthRatio,
      userBalance: tipper.totalBalance.toString(),
    };
  });

  const amountDistributed = newAllowances.reduce((acc, a) => acc + a.amount, 0);

  await prisma.$transaction(async (tx) => {
    const tipMeta = await tx.tipMeta.create({
      data: {
        tipMinimum: TIP_MINIMUM,
        totalAllowance: availableTotalAllowance,
        carriedOver: prevUnusedAllowance,
        usdPrice: fartherUsdPrice,
      },
    });

    await tx.tipAllowance.createMany({
      data: newAllowances.map((a) => ({
        ...a,
        tipMetaId: tipMeta.id,
      })),
    });
  });

  await Promise.all([
    flushCache({ type: cacheTypes.LEADERBOARD }),
    flushCache({ type: cacheTypes.TIP_META }),
    flushCache({
      type: cacheTypes.USER,
      ids: eligibleTippers.map((t) => t.id),
    }),
  ]);

  printDevLogs({
    latestTipMeta,
    eligibleTippers,
    prevUnusedAllowance,
    amountDistributed,
    fartherUsdPrice,
    maxAllowancePerTipper,
    minBreadthRatio,
  });

  console.info(
    `FINISHED distributeAllowances: ${amountDistributed.toLocaleString()} to ${eligibleTippers.length.toLocaleString()} tippers`,
  );
}

async function getLatestTipMeta() {
  const metas = await prisma.tipMeta.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      allowances: {
        select: {
          id: true,
          amount: true,
        },
      },
    },
  });
  return metas[0];
}

function printDevLogs({
  latestTipMeta,
  eligibleTippers,
  prevUnusedAllowance,
  amountDistributed,
  fartherUsdPrice,
  maxAllowancePerTipper,
  minBreadthRatio,
}: {
  latestTipMeta: Awaited<ReturnType<typeof getLatestTipMeta>>;
  eligibleTippers: Awaited<ReturnType<typeof getEligibleTippers>>;
  prevUnusedAllowance: number;
  amountDistributed: number;
  fartherUsdPrice: number;
  maxAllowancePerTipper: number;
  minBreadthRatio: number;
}) {
  if (latestTipMeta) {
    console.info(
      "Previous tip min:",
      latestTipMeta.tipMinimum.toLocaleString(),
    );
    console.info(
      "Previous total allowance:",
      latestTipMeta.totalAllowance.toLocaleString(),
    );
  }

  console.info(`Eligible tippers: ${eligibleTippers.length}`);
  console.info(`Previous unused allowance: ${prevUnusedAllowance}`);
  console.info("Amount distributed:", amountDistributed.toLocaleString());

  console.info(`Current price: $${fartherUsdPrice}`);
  console.info(`Max allowance per tipper: ${maxAllowancePerTipper}`);
  console.info(`Min breadth ratio: ${minBreadthRatio}`);
}
