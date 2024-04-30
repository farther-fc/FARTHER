import { BASE_TOKENS_PER_TWEET } from "@farther/common";
import { scaleLog } from "d3-scale";

export function getEvanglistAllocationBonus({
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

  return scalingFn(followerCount);
}
