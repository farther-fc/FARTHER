import { EVANGELIST_FOLLOWER_MINIMUM } from "@farther/common";
import { scaleLog } from "d3";

export function getEvanglistAllocationBonus({
  baseTokensPerTweet,
  followerCount,
}: {
  baseTokensPerTweet: number;
  followerCount: number;
}) {
  const MAXIMUM_FOLLOWER_COUNT = 10_000_000;

  const scalingFn = scaleLog()
    .domain([EVANGELIST_FOLLOWER_MINIMUM, MAXIMUM_FOLLOWER_COUNT])
    .range([0, baseTokensPerTweet * 10])
    .clamp(true);

  // TODO: It isn't ideal to round here. Figure out a better solution.
  return Math.round(scalingFn(followerCount));
}
