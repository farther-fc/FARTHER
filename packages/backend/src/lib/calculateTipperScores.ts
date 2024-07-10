import { getLatestTipperAirdrop } from "./getLatestTipperAirdrop";
import { getSeasonTippers } from "./getSeasonTippers";

export async function calculateTipperScores() {
  const latestAirdrop = await getLatestTipperAirdrop();

  const tipsThisSeason = await getSeasonTippers();
}
