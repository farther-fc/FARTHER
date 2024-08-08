import { DUST_AMOUNT } from "@farther/common";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import numeral from "numeral";
import { twMerge } from "tailwind-merge";
import { Address, formatEther } from "viem";

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

export const formatAirdropTime = (date: Date) => {
  const oneDay = 8.64e7;
  const fiveDays = oneDay * 5;
  // Calculate time until airdrop
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff > fiveDays) {
    // ex: "Jun 1"
    return dayjs(date).format("MMM D");
  }

  if (diff > oneDay / 2) {
    // ex: "Sun 3pm"
    return dayjs(date).format("ddd ha");
  }

  // ex: "1pm"
  return dayjs(date).format("ha");
};

export const formatWad = (amount: bigint, formatSchema: string = "0,0.00") => {
  const preppedAmount =
    amount < BigInt(DUST_AMOUNT) // Anything below this is effectively dust and leads to NaN
      ? BigInt(0)
      : amount;
  return numeral(formatEther(preppedAmount)).format(formatSchema);
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

export function strikeThrough(input: string | number): string {
  const str = input.toString();
  return str
    .split("")
    .map((char) => char + "\u0336")
    .join("");
}
