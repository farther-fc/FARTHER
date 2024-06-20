import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Bottleneck from "bottleneck";
import NodeCache from "node-cache";
import { chunk } from "underscore";

const cache = new NodeCache({ stdTTL: 60 * 60 });

const NEXT_PUBLIC_NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!NEXT_PUBLIC_NEYNAR_API_KEY) {
  throw new Error("NEXT_PUBLIC_NEYNAR_API_KEY is not set");
}

const NEYNAR_DATA_SIZE_LIMIT = 100;

const neynarClient = new NeynarAPIClient(NEXT_PUBLIC_NEYNAR_API_KEY);

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
  async getUsersByAddress(addresses: string[]) {
    const addressChunks = chunk(addresses, NEYNAR_DATA_SIZE_LIMIT);

    const bulkUsersArray = await Promise.all(
      addressChunks.map((addresses) =>
        neynarScheduler.schedule(() =>
          neynarClient.fetchBulkUsersByEthereumAddress(addresses),
        ),
      ),
    );

    return bulkUsersArray.reduce(
      (acc, cur) => {
        return { ...acc, ...cur };
      },
      {} as Record<string, User | User[]>,
    );
  },
};

export async function fetchUserByAddress(address: string) {
  const key = `address:${address}`;

  const cachedUser = cache.get(key);

  if (cachedUser) {
    return cachedUser as Awaited<
      ReturnType<typeof neynarClient.fetchBulkUsersByEthereumAddress>
    >;
  }

  const userResponse = await neynarClient.fetchBulkUsersByEthereumAddress([
    address,
  ]);

  cache.set(key, userResponse);

  return userResponse;
}

export async function fetchUserByFid(fid: number) {
  const key = `fid:${fid}`;

  const cachedUser = cache.get(key);

  if (cachedUser) {
    return cachedUser as Awaited<
      ReturnType<typeof neynarClient.fetchBulkUsers>
    >;
  }

  const userResponse = await neynarClient.fetchBulkUsers([fid]);

  cache.set(key, userResponse);

  return userResponse;
}

export type NeynarUser = User;
