import { TIP_SCORE_SCALER } from "@farther/common";
import Decimal from "decimal.js";
import { dayUTC } from "./dayUTC";

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

    // Change per token
    const changePerToken = openRankChangePerDay.div(tip.amount);

    // Scale up to human readable numbers
    return {
      hash: tip.hash,
      changePerToken: changePerToken.mul(TIP_SCORE_SCALER),
    };
  });
}
