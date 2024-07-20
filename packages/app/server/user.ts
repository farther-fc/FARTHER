import {
  cacheKeys,
  fetchUserByAddress,
  fetchUserByFid,
  getPowerBadgeFids,
} from "@farther/common";
import {
  PENDING_POWER_ALLOCATION_ID,
  PENDING_TIPS_ALLOCATION_ID,
} from "@lib/constants";
import { apiSchemas } from "@lib/types/apiSchemas";
import { User as NeynarUser } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import * as Sentry from "@sentry/nextjs";
import { TRPCError } from "@trpc/server";
import { kv } from "@vercel/kv";
import _ from "lodash";
import { publicProcedure } from "server/trpc";
import { Address, isAddress } from "viem";
import { AllocationType, TipMeta, prisma } from "../../backend/src/prisma";
import { tipsLeaderboard } from "./tips/utils/tipsLeaderboard";

export const getUser = publicProcedure
  .input(apiSchemas.getUser.input)
  .query(async (opts) => {
    const address = opts.input.address.toLowerCase() as Address;

    try {
      const latestTipMeta = await prisma.tipMeta.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });

      if (!latestTipMeta) {
        Sentry.captureException("latestTipMeta not found in getUser");
      }

      let dbUser = await getPrivateUser({
        address: address,
        latestAllowanceDate: latestTipMeta?.createdAt,
      });

      // If no user, fetch from Neynar and create all the user data in the database
      // then fetch the user (inefficient but easy)
      if (!dbUser) {
        const user = await getUserFromNeynar({ address });

        if (!user) {
          return null;
        }

        dbUser = await prisma.$transaction(async (tx) => {
          await tx.user.create({
            data: {
              id: user.fid,
              pfpUrl: user.pfpUrl,
              username: user.username,
              displayName: user.displayName,
              followerCount: user.followerCount,
            },
          });

          await tx.ethAccount.createMany({
            data: user.verifiedAddresses.map((address) => ({
              address: address.toLowerCase(),
            })),
          });

          await tx.userEthAccount.createMany({
            data: user.verifiedAddresses.map((address) => ({
              userId: user.fid,
              ethAccountId: address.toLowerCase(),
            })),
          });

          return await getPrivateUser({
            address: address,
            latestAllowanceDate: latestTipMeta?.createdAt,
          });
        });
      }

      const totalTipsReceived =
        dbUser?.tipsReceived.reduce((acc, t) => acc + t.amount, 0) || 0;

      const latestTipsReceived =
        latestTipMeta && dbUser
          ? dbUser?.tipsReceived.filter(
              (t) => t.createdAt > latestTipMeta.createdAt,
            )
          : [];

      const allocations = dbUser?.allocations || [];

      // If user has a power badge, add this dummy pending allocation for UX purposes
      // (doesn't get added for real until airdrop is created)
      if (
        dbUser?.powerBadge &&
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

      const unallocatedTips =
        dbUser?.tipsReceived.filter((t) => t.allocationId === null) || [];

      if (unallocatedTips.length > 0) {
        const totalUnallocatedTips = unallocatedTips.reduce(
          (total, tip) => tip.amount + total,
          0,
        );
        allocations.push({
          type: AllocationType.TIPS,
          id: PENDING_TIPS_ALLOCATION_ID,
          isClaimed: false,
          amount: BigInt(totalUnallocatedTips * 10 ** 18).toString(),
          referenceAmount: "0",
          baseAmount: "0",
          airdrop: null,
          index: null,
          tweets: [],
          address: "",
        });
      }

      const allowance = dbUser?.tipAllowances[0]?.amount || 0;
      const spent =
        dbUser?.tipAllowances[0]?.tips.reduce((acc, t) => t.amount + acc, 0) ||
        0;

      return {
        fid: dbUser?.id,
        username: dbUser?.username,
        displayName: dbUser?.displayName,
        pfpUrl: dbUser?.pfpUrl,
        powerBadge: dbUser?.powerBadge,
        tipperScore: dbUser?.tipScores[0]?.score || null,
        allocations,
        totalTipsReceived: {
          number: dbUser?.tipsReceived.length || 0,
          amount: totalTipsReceived,
        },
        totalTipsGiven: {
          number: dbUser?.tipsGiven.length || 0,
          amount: dbUser?.tipsGiven.reduce((acc, t) => acc + t.amount, 0) || 0,
        },
        latestTipsReceived: {
          number: latestTipsReceived.length,
          amount: latestTipsReceived.reduce((acc, t) => acc + t.amount, 0) || 0,
        },
        currentAllowance: {
          amount: dbUser?.tipAllowances[0]?.amount || 0,
          invalidatedAmount: dbUser?.tipAllowances[0]?.invalidatedAmount,
          tipsGiven: dbUser?.tipAllowances[0]?.tips.length || 0,
          spent,
          remaining:
            allowance -
            spent -
            (dbUser?.tipAllowances[0]?.invalidatedAmount || 0),
        },
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
  .query(async (opts) => {
    const address = opts.input.address.toLowerCase();

    if (!isAddress(address)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid address" });
    }

    return await getPublicUser({ address });
  });

export const publicGetUserByFid = publicProcedure
  .input(apiSchemas.publicGetUserByFid.input)
  .query(async (opts) => {
    const fid = opts.input.fid;

    return await getPublicUser({ fid });
  });

/********************************
 *          HELPERS
 ********************************/

async function getUserFromNeynar({
  address,
  fid,
}: {
  address?: string;
  fid?: number;
}) {
  if (!fid && !address) {
    throw new Error("Must provide either address or fid");
  }

  // if (!isProduction) {
  //   return {
  //     fid: DEV_USER_FID,
  //     username: "testuser",
  //     displayName: "Test User",
  //     pfpUrl:
  //       "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
  //     powerBadge: false,
  //     verifiedAddresses: [DEV_USER_ADDRESS],
  //   };
  // }

  let user: NeynarUser | null = null;

  if (address) {
    // Get user data from neynar
    const response = await fetchUserByAddress(address);

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
    user = accounts[0];
  } else if (fid) {
    // Get user data from neynar
    const { users: rawUserData } = await fetchUserByFid(fid);

    const powerBadgeFids = await getPowerBadgeFids();
    const accounts = rawUserData.map((a) => ({
      ..._.cloneDeep(a),
      // Need to override Neynar's data because they don't update power badge status frequently
      power_badge: powerBadgeFids.includes(a.fid),
    }));

    // Sort power users to the top
    accounts.sort((a, b) => (b.power_badge ? 1 : 0) - (a.power_badge ? 1 : 0));

    // Take the first one
    user = accounts[0];
  }
  if (!user) {
    return null;
  }

  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name,
    pfpUrl: user.pfp_url,
    powerBadge: user.power_badge,
    followerCount: user.follower_count,
    verifiedAddresses: user.verified_addresses.eth_addresses,
  };
}

// DB call for non-public API data
async function getPrivateUser({
  address,
  latestAllowanceDate = new Date(),
}: {
  address: Address;
  latestAllowanceDate?: Date;
}) {
  return await prisma.user.findFirst({
    where: {
      ethAccounts: {
        some: {
          ethAccountId: address,
        },
      },
    },
    orderBy: {
      followerCount: "desc",
    },
    take: 1,
    select: {
      id: true,
      username: true,
      pfpUrl: true,
      displayName: true,
      followerCount: true,
      powerBadge: true,
      tipScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipAllowances: {
        where: {
          createdAt: {
            gte: latestAllowanceDate,
          },
        },
        include: {
          tips: {
            where: {
              invalidTipReason: null,
            },
          },
        },
      },
      tipsGiven: {
        where: {
          invalidTipReason: null,
        },
      },
      tipsReceived: {
        where: {
          invalidTipReason: null,
        },
      },
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

// DB call for public API data
async function getPublicUserFromDb({
  fid,
  address,
  currentTipMeta,
}: {
  fid?: number;
  address?: string;
  currentTipMeta: TipMeta | null;
}) {
  const currentTipCycleStart = currentTipMeta?.createdAt || new Date();

  if (!fid && !address) {
    throw new Error("Must provide either address or fid");
  }

  const user = await prisma.user.findFirst({
    where: fid
      ? { id: fid }
      : {
          ethAccounts: {
            some: {
              ethAccountId: address,
            },
          },
        },
    select: {
      id: true,
      username: true,
      pfpUrl: true,
      displayName: true,
      followerCount: true,
      powerBadge: true,
      tipScores: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipAllowances: {
        where: {
          createdAt: {
            gte: currentTipCycleStart,
          },
        },
        include: {
          tips: {
            where: {
              invalidTipReason: null,
            },
          },
        },
      },
      tipsGiven: {
        where: {
          invalidTipReason: null,
        },
      },
      tipsReceived: {
        where: {
          invalidTipReason: null,
        },
      },
      allocations: {
        where: {
          isInvalidated: false,
        },
        select: {
          id: true,
          amount: true,
          isClaimed: true,
          index: true,
          type: true,
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

  if (!user) {
    console.warn("User not found in database. fid:", fid);
    return null;
  }

  return user;
}

async function getPublicUser({
  address,
  fid,
}: {
  address?: string;
  fid?: number;
}) {
  const cachedData = await kv.get<
    Awaited<ReturnType<typeof getUncachedPublicUser>>
  >(cacheKeys.USER);

  if (cachedData) {
    console.info("Cache hit for tip meta data");

    return cachedData;
  }

  console.info("Cache miss for tip meta data");

  return await getUncachedPublicUser({ address, fid });
}

async function getUncachedPublicUser({
  address,
  fid,
}: {
  address?: string;
  fid?: number;
}) {
  if (!address && !fid) {
    throw new Error("Must provide either address or fid");
  }

  const leaderboard = await tipsLeaderboard();

  const currentTipMeta = await getCurrentTipMeta();

  const dbUser = await getPublicUserFromDb({
    address,
    currentTipMeta,
  });

  if (!dbUser) {
    console.warn("User not found in database. address:", address);
    return null;
  }

  const latestTipsReceived =
    currentTipMeta && dbUser
      ? dbUser?.tipsReceived.filter(
          (t) => t.createdAt > currentTipMeta.createdAt,
        )
      : [];

  const latestTipAllowance = dbUser.tipAllowances[0];

  const givenAmount = latestTipAllowance
    ? latestTipAllowance.tips.reduce((acc, t) => acc + t.amount, 0)
    : null;

  const receivedAmount = latestTipsReceived.reduce(
    (acc, t) => acc + t.amount,
    0,
  );

  const remainingAllowance = latestTipAllowance?.invalidatedAmount
    ? 0
    : latestTipAllowance && givenAmount
      ? latestTipAllowance.amount - givenAmount
      : null;

  const rankIndex = leaderboard.findIndex((u) => u.fid === dbUser.id);

  return {
    fid: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.displayName,
    pfpUrl: dbUser.pfpUrl,
    followerCount: dbUser.followerCount,
    powerBadge: dbUser.powerBadge,
    tipperScore: dbUser.tipScores[0]?.score || null,
    tips: {
      rank: rankIndex > -1 ? rankIndex + 1 : null,
      totals: {
        givenCount: dbUser.tipsGiven.length,
        givenAmount: dbUser.tipsGiven.reduce((acc, t) => acc + t.amount, 0),
        receivedCount: dbUser.tipsReceived.length,
        receivedAmount: dbUser.tipsReceived.reduce(
          (acc, t) => acc + t.amount,
          0,
        ),
      },
      currentCycle: {
        startTime: currentTipMeta ? currentTipMeta.createdAt : null,
        allowance: latestTipAllowance ? latestTipAllowance.amount : null,
        userBalance: latestTipAllowance ? latestTipAllowance.userBalance : null,
        givenCount: latestTipAllowance ? latestTipAllowance.tips.length : null,
        givenAmount,
        remainingAllowance,
        invalidatedAmount: latestTipAllowance?.invalidatedAmount,
        receivedCount: latestTipsReceived.length,
        receivedAmount,
        tipMinimum: currentTipMeta?.tipMinimum,
        eligibleTippers: currentTipMeta?._count.allowances,
      },
    },
    allocations: dbUser.allocations,
  };
}

async function getCurrentTipMeta() {
  return await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
    include: {
      _count: {
        select: {
          allowances: true,
        },
      },
    },
  });
}
