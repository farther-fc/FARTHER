import Bottleneck from "bottleneck";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dbLimiter = new Bottleneck({
  maxConcurrent: 60,
});
