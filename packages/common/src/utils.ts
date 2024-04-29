import crypto from "crypto";
import { AllocationType } from "../../backend/src/prisma";
import { ChainId } from "./env";

export function startOfNextMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const nextMonth = new Date(currentYear, currentMonth + 1);

  // Set the next month date to the first day at 00:00:00
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);

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
