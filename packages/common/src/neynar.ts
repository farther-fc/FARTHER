import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import Bottleneck from "bottleneck";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not set");
}

export const NEYNAR_DATA_SIZE_LIMIT = 100;

export const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

export const neynarScheduler = new Bottleneck({
  minTime: 200,
  maxConcurrent: 3,
});
