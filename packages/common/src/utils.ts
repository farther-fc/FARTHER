import crypto from "crypto";
import { AllocationType } from "../../backend/src/prisma";
import { ChainId } from "./env";

export function getStartOfNextMonthUTC() {
  // Get the current date in UTC
  const currentDate = new Date();

  // Extract the year and month in UTC
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();

  // Calculate the first day of the next month
  const nextMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 1, 0, 0, 0, 0),
  );

  return nextMonth;
}

// Using hash of user ID, allocation type, chain ID, and airdrop start time as the unique identifier
export function getAllocationId({
  userId,
  type,
  chainId,
  airdropStartTime,
}: {
  userId: number;
  type: AllocationType;
  chainId: ChainId;
  airdropStartTime: number;
}) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ userId, type, chainId, airdropStartTime }))
    .digest("hex");
}
