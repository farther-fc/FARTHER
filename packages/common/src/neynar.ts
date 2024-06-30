import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { User } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import Bottleneck from "bottleneck";
import NodeCache from "node-cache";
import { chunk } from "underscore";
import { ENVIRONMENT } from "./env";

const cache = new NodeCache({ stdTTL: 60 * 60 });

const NEYNAR_DATA_SIZE_LIMIT = 100;

const NEXT_PUBLIC_NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "";

const neynarScheduler = new Bottleneck({
  minTime: 200,
  maxConcurrent: 3,
});

let neynarClient: NeynarAPIClient;

try {
  if (ENVIRONMENT !== "development" && !NEXT_PUBLIC_NEYNAR_API_KEY) {
    throw new Error(
      "NEXT_PUBLIC_NEYNAR_API_KEY must be set for non-development environments",
    );
  }

  neynarClient = new NeynarAPIClient(NEXT_PUBLIC_NEYNAR_API_KEY);
} catch (e: any) {
  if (
    !e.message.includes(
      "Attempt to use an authenticated API method without first providing an api key",
    )
  ) {
    console.error(e);
  }
}

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
    const users: Record<string, User[]> = {};

    const addressChunks = chunk(addresses, NEYNAR_DATA_SIZE_LIMIT);

    for (const chunk of addressChunks) {
      try {
        const currentChunkUsers =
          await neynarClient.fetchBulkUsersByEthereumAddress(chunk);

        for (const address in currentChunkUsers) {
          users[address] = currentChunkUsers[address];
        }
      } catch (error: any) {
        console.log(error);
        if (error.status === 404) {
          for (const address of chunk) {
            try {
              const response = await fetchUserByAddress(address);
              users[address] = response[address];
            } catch (error) {
              console.error(`Neynar didn't find user for address: ${address}`);
            }
          }
        }
      }
    }

    return users;
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
