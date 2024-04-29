import { BASE_TOKENS_PER_TWEET, WAD_SCALER } from "@farther/common";
import { scaleLog } from "d3-scale";

export function getEvanglistAllocation({
  followerCount,
}: {
  followerCount: number;
}) {
  const MINIMUM_FOLLOWER_COUNT = 100;
  const MAXIMUM_FOLLOWER_COUNT = 30_000_000;

  const scalingFn = scaleLog()
    .domain([MINIMUM_FOLLOWER_COUNT, MAXIMUM_FOLLOWER_COUNT])
    .range([BASE_TOKENS_PER_TWEET, BASE_TOKENS_PER_TWEET * 30])
    .clamp(true);

  return BigInt(BASE_TOKENS_PER_TWEET + scalingFn(followerCount)) * WAD_SCALER;
}
