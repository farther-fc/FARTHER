import { Address, encodeAbiParameters, keccak256 } from "viem";
import { DEV_USER_FID, WARPCAST_API_BASE_URL } from "./constants";
import { isProduction } from "./env";

export function getStartOfMonthUTC(months: number = 1) {
  // Get the current date in UTC
  const currentDate = new Date();

  // Extract the year and month in UTC
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();

  // Calculate the first day of the next month
  const date = new Date(
    Date.UTC(currentYear, currentMonth + months, 1, 0, 0, 0, 0),
  );

  return date;
}

export const getIncentiveKey = ({
  rewardToken,
  pool,
  startTime,
  endTime,
  refundee,
  hashed,
}: {
  rewardToken: Address;
  pool: Address;
  startTime: number;
  endTime: number;
  refundee: Address;
  hashed: boolean;
}) => {
  const encodedData = encodeAbiParameters(
    [
      { type: "address", name: "rewardToken" },
      { type: "address", name: "pool" },
      { type: "uint256", name: "startTime" },
      { type: "uint256", name: "endTime" },
      { type: "address", name: "refundee" },
    ],
    [rewardToken, pool, BigInt(startTime), BigInt(endTime), refundee],
  );

  if (hashed) {
    return keccak256(encodedData);
  }

  return encodedData;
};

export async function getPowerBadgeFids() {
  const warpcastResponse = (await (
    await fetch(`${WARPCAST_API_BASE_URL}power-badge-users`)
  ).json()) as { result: { fids: number[] } };

  const powerBadgeFids = warpcastResponse.result.fids;

  if (!powerBadgeFids.length) {
    throw new Error("Warpcast didn't return any power badge FIDs.");
  }

  if (!isProduction) {
    powerBadgeFids.push(DEV_USER_FID);
  }

  return powerBadgeFids;
}

export function maxBigInt(...values: bigint[]) {
  if (values.length === 0) {
    throw new Error("No values provided");
  }
  return values.reduce(
    (max, current) => (current > max ? current : max),
    values[0],
  );
}
