import {
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  WARPCAST_API_BASE_URL,
  isProduction,
  neynarClient,
} from "@farther/common";
import { PENDING_ALLOCATION_ID } from "@lib/constants";
import { apiSchemas } from "@lib/types/apiSchemas";
import _ from "lodash";
import { publicProcedure } from "server/trpc";
import { AllocationType, prisma } from "../../backend/src/prisma";

export const getUser = publicProcedure
  .input(apiSchemas.getUser.input)
  .query(async (opts) => {
    const address = opts.input.address.toLowerCase();

    let fid: number;

    try {
      const user = await getUserFromNeynar(address);

      if (!user) {
        return null;
      }

      fid = user.fid;

      const dbUser = await getDbUserByFid(fid);

      if (!dbUser) {
        await prisma.user.create({
          data: { id: fid },
        });
      }

      const allocations = dbUser?.allocations || [];

      // If user has a power badge, add this dummy pending allocation for UX purposes
      // (doesn't get added for real until airdrop is created)
      if (
        user.power_badge &&
        !allocations.find((a) => a.type === AllocationType.POWER_USER)
      ) {
        allocations.push({
          type: AllocationType.POWER_USER,
          id: PENDING_ALLOCATION_ID,
          isClaimed: false,
          amount: "0",
          baseAmount: "0",
          airdrop: null,
          index: null,
          tweets: [],
          address: "",
        });
      }

      return {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        powerBadge: user.power_badge,
        verifiedAddress: user.verified_address,
        allocations,
      };
    } catch (error: any) {
      if (error.response && error.response.statusText === "Not Found") {
        console.warn("User not found in Neynar", address);
      } else {
        throw error;
      }
    }
  });

function getDbUserByFid(fid: number) {
  return prisma.user.findFirst({
    where: {
      id: fid,
    },
    select: {
      allocations: {
        select: {
          id: true,
          amount: true,
          baseAmount: true,
          isClaimed: true,
          index: true,
          type: true,
          tweets: true,
          address: true,
          airdrop: {
            select: {
              id: true,
              address: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      },
    },
  });
}

async function getUserFromNeynar(address: string) {
  if (!isProduction && address === DEV_USER_ADDRESS.toLowerCase()) {
    return {
      fid: DEV_USER_FID,
      username: "testuser",
      display_name: "Test User",
      pfp_url:
        "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
      power_badge: false,
      verified_address: DEV_USER_ADDRESS,
    };
  }

  // Get user data from neynar
  const response = await neynarClient.fetchBulkUsersByEthereumAddress([
    address,
  ]);

  // Neynar returns weird data structure
  const rawUserData = response[address] ? response[address] : [];

  const powerBadgeFids = await getPowerBadgeFids();
  const accounts = rawUserData.map((a) => ({
    ..._.cloneDeep(a),
    // Need to override Neynar's data because they don't update power badge status frequently
    power_badge: powerBadgeFids.includes(a.fid),
  }));

  // Sort power users to the top
  accounts.sort((a, b) => (b.power_badge ? 1 : 0) - (a.power_badge ? 1 : 0));

  // Take the first one
  const user = accounts[0];

  if (!user) {
    return null;
  }

  return {
    fid: user?.fid,
    username: user?.username,
    display_name: user?.display_name,
    pfp_url: user?.pfp_url,
    power_badge: user?.power_badge,
    verified_address: user?.verified_addresses.eth_addresses[0],
  };
}

async function getPowerBadgeFids() {
  const warpcastResponse = (await (
    await fetch(`${WARPCAST_API_BASE_URL}power-badge-users`)
  ).json()) as { result: { fids: number[] } };

  return warpcastResponse.result.fids;
}
