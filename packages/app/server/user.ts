import { prisma } from "../../backend/src/prisma";
import { publicProcedure } from "server/trpc";
import { apiSchemas } from "@lib/types/apiSchemas";
import { isProduction, neynarClient } from "@farther/common";
import { DEV_USER_ADDRESS, DEV_USER_FID } from "@farther/common";
import { TRPCError } from "@trpc/server";

export const getUser = publicProcedure
  .input(apiSchemas.getUser.input)
  .query(async (opts) => {
    const address = opts.input.address.toLowerCase();

    try {
      // Get user data from neynar
      const response = await neynarClient.fetchBulkUsersByEthereumAddress([
        opts.input.address,
      ]);

      // Neynar returns weird data structure
      const [user] = response[address] ? response[address] : [];

      // In prod, if Neynar doesn't find a user, return null.
      // But in staging/dev we use the test user (which we know isn't on Farcaster or in Neynar's db)
      if (!user && isProduction) {
        return null;
      }

      const fid = isProduction ? user.fid : DEV_USER_FID;
      const isPowerUser = isProduction ? user.power_badge : true;

      const dbUser = await prisma.user.upsert({
        where: {
          address,
          fid,
        },
        create: {
          address,
          fid,
          isPowerUser,
        },
        update: {},
        select: {
          allocations: {
            select: {
              id: true,
              amount: true,
              isClaimed: true,
              index: true,
              type: true,
              airdrop: {
                select: { id: true, address: true, number: true },
              },
            },
          },
        },
      });

      if (!isProduction) {
        if (
          opts.input.address.toLowerCase() !== DEV_USER_ADDRESS.toLowerCase()
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Connect with ${DEV_USER_ADDRESS} to see the test user.`,
          });
        }
        return {
          fid: DEV_USER_FID,
          username: "testuser",
          displayName: "Test User",
          pfpUrl:
            "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
          profileBio: "Test bio",
          allocations: dbUser?.allocations,
        };
      }

      return {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        profileBio: user.profile.bio.text,
        allocations: dbUser?.allocations,
      };
    } catch (error) {
      // TODO: Log to Sentry
      console.log(error);
      return null;
    }
  });
