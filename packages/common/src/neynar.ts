import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { chunk } from "underscore";
import Bottleneck from "bottleneck";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not set");
}

const NEYNAR_DATA_SIZE_LIMIT = 100;

const neynarClient = new NeynarAPIClient(NEYNAR_API_KEY);

const neynarScheduler = new Bottleneck({
  minTime: 200,
  maxConcurrent: 3,
});

export const neynar = {
  async getUsers(fids: number[]) {
    const fidChunks = chunk(fids, NEYNAR_DATA_SIZE_LIMIT);

    const bulkUsersArray = await Promise.all(
      fidChunks.map((fids) =>
        neynarScheduler.schedule(() => neynarClient.fetchBulkUsers(fids)),
      ),
    );

    return bulkUsersArray.map((data) => data.users).flat();
  },
};
