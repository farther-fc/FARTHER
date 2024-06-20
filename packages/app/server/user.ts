import {
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  cacheTimes,
  fetchUserByAddress,
  fetchUserByFid,
  getPowerBadgeFids,
  isProduction,
} from "@farther/common";
import {
  PENDING_POWER_ALLOCATION_ID,
  PENDING_TIPS_ALLOCATION_ID,
} from "@lib/constants";
import { apiSchemas } from "@lib/types/apiSchemas";
import { User as NeynarUser } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import * as Sentry from "@sentry/nextjs";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { publicProcedure } from "server/trpc";
import { isAddress } from "viem";
import { AllocationType, TipMeta, prisma } from "../../backend/src/prisma";

export const getUser = publicProcedure
  .input(apiSchemas.getUser.input)
  .query(async (opts) => {
    const address = opts.input.address.toLowerCase();

    let fid: number;

    try {
      const user = await getUserFromNeynar({ address });

      if (!user) {
        return null;
      }

      fid = user.fid;

      const latestTipMeta = await prisma.tipMeta.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });

      if (!latestTipMeta) {
        Sentry.captureException("latestTipMeta not found in getUser");
      }

      const dbUser = await getPrivateUser({
        fid,
        latestAllowanceDate: latestTipMeta?.createdAt,
      });

      if (!dbUser) {
        await prisma.user.create({
          data: { id: fid },
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
        user.powerBadge &&
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
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
        powerBadge: user.powerBadge,
        verifiedAddress: user.verifiedAddresses[0],
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
  .query(async (opts) => {
    opts.ctx.res.setHeader(
      "cache-control",
      `s-maxage=${cacheTimes.PUBLIC_USER}, stale-while-revalidate=1`,
    );

    const address = opts.input.address.toLowerCase();

    if (!isAddress(address)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid address" });
    }

    const neynarUserData = await getUserFromNeynar({ address });

    if (!neynarUserData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No user data returned from Neynar",
      });
    }

    const currentTipMeta = await prisma.tipMeta.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    const dbUser = await getPublicUser({
      fid: neynarUserData.fid,
      currentTipMeta,
    });

    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found in database",
      });
    }

    return prepPublicUser({ dbUser, neynarUserData, currentTipMeta });
  });

export const publicGetUserByFid = publicProcedure
  .input(apiSchemas.publicGetUserByFid.input)
  .query(async (opts) => {
    opts.ctx.res.setHeader(
      "cache-control",
      `s-maxage=${cacheTimes.PUBLIC_USER}, stale-while-revalidate=1`,
    );

    const fid = opts.input.fid;

    const currentTipMeta = await prisma.tipMeta.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    const dbUser = await getPublicUser({ fid, currentTipMeta });

    if (!dbUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found in database",
      });
    }

    const neynarUserData = await getUserFromNeynar({
      fid,
    });

    return prepPublicUser({ dbUser, neynarUserData, currentTipMeta });
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

  if (!isProduction && address === DEV_USER_ADDRESS.toLowerCase()) {
    return {
      fid: DEV_USER_FID,
      username: "testuser",
      displayName: "Test User",
      pfpUrl:
        "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
      powerBadge: false,
      verifiedAddresses: [DEV_USER_ADDRESS],
    };
  }

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
    fid: user?.fid,
    username: user?.username,
    displayName: user?.display_name,
    pfpUrl: user?.pfp_url,
    powerBadge: user?.power_badge,
    verifiedAddresses: user?.verified_addresses.eth_addresses,
  };
}

// DB call for non-public API data
async function getPrivateUser({
  fid,
  latestAllowanceDate = new Date(),
}: {
  fid: number;
  latestAllowanceDate?: Date;
}) {
  return await prisma.user.findFirst({
    where: {
      id: fid,
    },
    select: {
      id: true,
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
async function getPublicUser({
  fid,
  currentTipMeta,
}: {
  fid: number;
  currentTipMeta: TipMeta | null;
}) {
  const currentTipCycleStart = currentTipMeta?.createdAt || new Date();

  const user = await prisma.user.findFirst({
    where: {
      id: fid,
    },
    select: {
      id: true,
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
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found in database",
    });
  }

  return user;
}

function prepPublicUser({
  dbUser,
  neynarUserData,
  currentTipMeta,
}: {
  dbUser: Awaited<ReturnType<typeof getPublicUser>>;
  neynarUserData: Awaited<ReturnType<typeof getUserFromNeynar>>;
  currentTipMeta: TipMeta | null;
}) {
  const latestTipsReceived =
    currentTipMeta && dbUser
      ? dbUser?.tipsReceived.filter(
          (t) => t.createdAt > currentTipMeta.createdAt,
        )
      : [];

  const latestTipAllowance = dbUser.tipAllowances[0];

  const givenAmount = latestTipAllowance
    ? latestTipAllowance.tips.reduce((acc, t) => acc + t.amount, 0)
    : undefined;

  const receivedAmount = latestTipsReceived.reduce(
    (acc, t) => acc + t.amount,
    0,
  );
  const remainingAllowance =
    latestTipAllowance && givenAmount
      ? latestTipAllowance.amount - givenAmount
      : undefined;

  return {
    ...neynarUserData,
    tips: {
      totals: {
        givenCount: dbUser.tipsGiven.length,
        givenAmount: dbUser.tipsGiven.reduce((acc, t) => acc + t.amount, 0),
        receivedCount: dbUser.tipsReceived.length,
        receivedAmount: dbUser.tipsReceived.reduce(
          (acc, t) => acc + t.amount,
          0,
        ),
      },
      currentCycle: latestTipAllowance
        ? {
            startTime: latestTipAllowance.createdAt,
            allowance: latestTipAllowance.amount,
            userBalance: latestTipAllowance.userBalance,
            givenCount: latestTipAllowance.tips.length,
            givenAmount,
            remainingAllowance,
            receivedCount: latestTipsReceived.length,
            receivedAmount,
            tipMinimum: currentTipMeta?.tipMinimum,
          }
        : null,
    },
    allocations: dbUser.allocations,
  };
}
