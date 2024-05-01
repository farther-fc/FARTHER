import { scaleLog } from "d3-scale";

export function getEvanglistAllocationBonus({
  baseTokensPerTweet,
  followerCount,
}: {
  baseTokensPerTweet: number;
  followerCount: number;
}) {
  const MINIMUM_FOLLOWER_COUNT = 100;
  const MAXIMUM_FOLLOWER_COUNT = 30_000_000;

  const scalingFn = scaleLog()
    .domain([MINIMUM_FOLLOWER_COUNT, MAXIMUM_FOLLOWER_COUNT])
    .range([baseTokensPerTweet, baseTokensPerTweet * 30])
    .clamp(true);

  // TODO: It isn't ideal to round here. Figure out a better solution.
  return Math.round(scalingFn(followerCount));
}
