import {
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  getPowerBadgeFids,
  isProduction,
  neynarClient,
} from "@farther/common";
import {
  PENDING_POWER_ALLOCATION_ID,
  PENDING_TIPS_ALLOCATION_ID,
} from "@lib/constants";
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

      const totalTipsReceived = dbUser?.tipsReceived.reduce(
        (acc, t) => acc + t.amount,
        0,
      );

      const latestTipMeta = await prisma.tipMeta.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });

      const latestTipsReceived =
        latestTipMeta && dbUser
          ? dbUser?.tipsReceived
              .filter((t) => t.createdAt > latestTipMeta.createdAt)
              .reduce((acc, t) => t.amount + acc, 0)
          : 0;

      // console.log("totalTipsReceived", totalTipsReceived);
      // console.log("latestTipMeta", latestTipMeta);
      // console.log("latestTipsReceived", latestTipsReceived);

      const allocations = dbUser?.allocations || [];

      // If user has a power badge, add this dummy pending allocation for UX purposes
      // (doesn't get added for real until airdrop is created)
      if (
        user.power_badge &&
        !allocations.find((a) => a.type === AllocationType.POWER_USER)
      ) {
        allocations.push({
          type: AllocationType.POWER_USER,
          id: PENDING_POWER_ALLOCATION_ID,
          isClaimed: false,
          amount: "0",
          referenceAmount: "0",
          baseAmount: "0",
          airdrop: null,
          index: null,
          tweets: [],
          address: "",
        });
      }

      if (totalTipsReceived) {
        allocations.push({
          type: AllocationType.TIPS,
          id: PENDING_TIPS_ALLOCATION_ID,
          isClaimed: false,
          amount: BigInt(totalTipsReceived * 10 ** 18).toString(),
          referenceAmount: "0",
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
        totalTipsReceived,
        latestTipsReceived,
        tipAllowance: dbUser?.tipAllowances[0],
      };
    } catch (error: any) {
      if (error.response && error.response.statusText === "Not Found") {
        console.warn("User not found in Neynar", address);
      } else {
        throw error;
      }
    }
  });

export const publicGetUserByAddress = publicProcedure
  .input(apiSchemas.publicGetUserByAddress.input)
  .query(async (fid) => {
    // TODO
  });

export const publicGetUserByFid = publicProcedure
  .input(apiSchemas.publicGetUserByFid.input)
  .query(async (opts) => {
    const fid = opts.input;

    const user = await getDbUserByFid(fid);

    const latestTipAllowance = user?.tipAllowances[0];

    const tipAmountSpent =
      latestTipAllowance?.tips.reduce((acc, t) => acc + t.amount, 0) || 0;

    return {
      fid,
      latestTipAllowance: latestTipAllowance
        ? {
            createdAt: latestTipAllowance.createdAt,
            amount: latestTipAllowance.amount,
            tipsGiven: latestTipAllowance.tips.length,
            tipsGivenAmount: tipAmountSpent,
          }
        : null,
    };
  });

/********************************
 *          HELPERS
 ********************************/

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

function getDbUserByFid(fid: number) {
  return prisma.user.findFirst({
    where: {
      id: fid,
    },
    select: {
      tipAllowances: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          tips: true,
        },
      },
      tipsReceived: true,
      allocations: {
        where: {
          isInvalidated: false,
        },
        select: {
          id: true,
          amount: true,
          baseAmount: true,
          referenceAmount: true,
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
