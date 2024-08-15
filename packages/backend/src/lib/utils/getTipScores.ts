import { dayUTC } from "@farther/common";
import { scaleLinear } from "d3";
import Decimal from "decimal.js";

// @dwr.eth == 0.188
const CURRENT_MAX_ENGAGEMENT_SCORE = 0.2;

// OpenRank engagement score has much bigger % gains when it starts low, so this
// counters it by increasing the impact of tips to users with higher engagement scores
const getDampener = scaleLinear()
  .domain([0, CURRENT_MAX_ENGAGEMENT_SCORE])
  .range([1, 3]);

/**
 * For each tip, this calculates the OpenRank score change of the recipient per token tipped
 */
export async function getTipScores({
  tips,
  endScores,
  endTime = new Date(),
}: {
  tips: {
    hash: string;
    tipperId: number;
    tippeeId: number;
    createdAt: Date;
    amount: number;
    // Prisma returns nullable type even if you specify not null
    tippeeOpenRankScore: number | null;
  }[];
  endScores: { [fid: number]: number };
  endTime?: Date;
}) {
  return tips.map((tip) => {
    const startScore = new Decimal(tip.tippeeOpenRankScore || 0);
    const latestScore = new Decimal(endScores[tip.tippeeId]);

    // Change in OpenRank score per day
    const daysSinceTip = dayUTC(endTime).diff(tip.createdAt, "day", true);
    const openRankChange = latestScore.div(startScore).mul(100).sub(100);
    const openRankChangePerDay = openRankChange.div(daysSinceTip);

    const dampenedChange = openRankChangePerDay.mul(
      getDampener(startScore.toNumber()),
    );

    // Change per token
    const changePerToken = openRankChangePerDay.mul(tip.amount);
    const altChangePerToken = dampenedChange.mul(tip.amount);

    // Scale up to human readable numbers
    return {
      hash: tip.hash,
      changePerToken,
      altChangePerToken,
    };
  });
}
