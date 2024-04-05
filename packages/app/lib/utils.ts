import Bottleneck from "bottleneck";
import { clsx, type ClassValue } from "clsx";
import numeral from "numeral";
import { twMerge } from "tailwind-merge";
import { Address, encodeAbiParameters, formatEther, keccak256 } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dbLimiter = new Bottleneck({
  maxConcurrent: 60,
});

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

export const formatDate = (date: Date) => {
  const language =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
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
