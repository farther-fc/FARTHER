import { clsx, type ClassValue } from "clsx";
import numeral from "numeral";
import { twMerge } from "tailwind-merge";
import { Address, encodeAbiParameters, formatEther, keccak256 } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shortenHash = (
  hash: Address = "0x",
  charLength: number = 6,
  postCharLength: number = 2,
) => {
  return (
    hash.slice(0, charLength) +
    "..." +
    hash.slice(hash.length - postCharLength, hash.length)
  );
};

export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  },
) => {
  const language =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  return new Intl.DateTimeFormat(language, options).format(new Date(date));
};

export const formatWad = (amount: string, formatSchema: string = "0,0") => {
  return numeral(formatEther(BigInt(amount))).format(formatSchema);
};

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

export const isValidTweetUrl = (url: string) => {
  const tweetValidatorRegex =
    /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/status\/[0-9]+$/;

  return tweetValidatorRegex.test(url);
};

export function extractTweetId(tweetUrl: string) {
  if (!isValidTweetUrl(tweetUrl)) {
    return false;
  }

  const tweetIdRegex = /\/status\/(\d+)/;
  const match = tweetIdRegex.exec(tweetUrl);

  return match ? match[1] : null; // Returns the tweet ID if matched, otherwise null
}

export function removeFalsyValues<T>(list: readonly T[]): NonNullable<T>[] {
  return list.filter(
    (item): item is NonNullable<T> => item != null,
  ) as NonNullable<T>[];
}

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
