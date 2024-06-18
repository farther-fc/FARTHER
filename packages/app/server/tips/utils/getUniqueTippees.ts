import { getEligibleTippers } from "server/tips/utils/getEligibleTippers";

export function getUniqueTippees(
  tipsGiven: Awaited<
    ReturnType<typeof getEligibleTippers>
  >[number]["tipsGiven"],
) {
  return new Set(
    tipsGiven
      .filter((t) => {
        // Only include tippees that have not received a tip allowance
        return !t.tippee.tipAllowances[0];
      })
      .map((t) => t.tippeeId),
  ).size;
}
