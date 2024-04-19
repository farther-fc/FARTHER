import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { chunk } from "underscore";
import Bottleneck from "bottleneck";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";

const NEXT_PUBLIC_NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!NEXT_PUBLIC_NEYNAR_API_KEY) {
  throw new Error("NEXT_PUBLIC_NEYNAR_API_KEY is not set");
}

const NEYNAR_DATA_SIZE_LIMIT = 100;

export const neynarClient = new NeynarAPIClient(NEXT_PUBLIC_NEYNAR_API_KEY);

const neynarScheduler = new Bottleneck({
  minTime: 200,
  maxConcurrent: 3,
});

export const neynarLimiter = {
  async getUsersByFid(fids: number[]) {
    const fidChunks = chunk(fids, NEYNAR_DATA_SIZE_LIMIT);

    const bulkUsersArray = await Promise.all(
      fidChunks.map((fids) =>
        neynarScheduler.schedule(() => neynarClient.fetchBulkUsers(fids)),
      ),
    );

    return bulkUsersArray.map((data) => data.users).flat();
  },
};

export type NeynarUser = User;
