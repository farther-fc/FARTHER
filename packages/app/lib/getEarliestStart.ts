import { GetUserOuput } from "@lib/types/apiTypes";

export function getEarliestStart(
  allocations: NonNullable<GetUserOuput>["allocations"],
) {
  return allocations.reduce((acc, cur) => {
    return new Date(
      cur.airdrop?.startTime || Number.POSITIVE_INFINITY,
    ).getTime() < acc
      ? new Date(cur.airdrop?.startTime || Number.POSITIVE_INFINITY).getTime()
      : acc;
  }, Number.POSITIVE_INFINITY);
}
