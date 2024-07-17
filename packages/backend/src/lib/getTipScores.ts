import { TIP_SCORE_SCALER } from "@farther/common";
import dayjs from "dayjs";
import Decimal from "decimal.js";

/**
 * For each tip, this calculates the OpenRank score change of the recipient per token tipped
 */
export async function getTipScores({
  tips,
  latestTippeeOpenRankScores,
}: {
  tips: {
    hash: string;
    tipperId: number;
    tippeeId: number;
    createdAt: Date;
    amount: number;
    startScore: number | null;
  }[];
  latestTippeeOpenRankScores: { [fid: number]: number };
}) {
  return tips.map((tip) => {
    const startScore = new Decimal(tip.startScore || 0);
    const latestScore = new Decimal(latestTippeeOpenRankScores[tip.tippeeId]);

    // Change in OpenRank score per day
    const daysSinceTip = dayjs().diff(tip.createdAt, "day", true);
    const openRankChange = latestScore.div(startScore).mul(100).sub(100);
    const openRankChangePerDay = openRankChange.div(daysSinceTip);

    // Change per token
    const changePerToken = openRankChangePerDay.div(tip.amount);

    // Scale up to human readable numbers
    return {
      hash: tip.hash,
      changePerToken: changePerToken.mul(TIP_SCORE_SCALER),
    };
  });
}
