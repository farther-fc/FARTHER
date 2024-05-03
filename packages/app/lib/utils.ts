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

export const formatAirdropTime = (date: Date) => {
  const oneDay = 8.64e7;
  const fiveDays = oneDay * 5;
  // Calculate time until airdrop
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff > fiveDays) {
    return formatDate(date, {
      month: "short",
      day: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  if (diff > oneDay / 2) {
    return formatDate(date, {
      weekday: "short",
      minute: "2-digit",
      hour: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  return formatDate(date, {
    minute: "2-digit",
    hour: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};

export const formatWad = (amount: string, formatSchema: string = "0,0.00") => {
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
  // Added `(\?.*)?$` to allow optional query parameters
  const tweetValidatorRegex =
    /^(https?:\/\/)?(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/status\/[0-9]+(\?.*)?$/;

  return tweetValidatorRegex.test(url);
};

export function extractTweetId(tweetUrl: string) {
  if (!isValidTweetUrl(tweetUrl)) {
    return null;
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
