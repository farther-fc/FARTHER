import { AllocationType, prisma } from "../../backend/src/prisma";
import { publicProcedure } from "server/trpc";
import { apiSchemas } from "@lib/types/apiSchemas";
import { isProduction, neynarClient } from "@farther/common";
import { DEV_USER_ADDRESS, DEV_USER_FID } from "@farther/common";
import { pendingAllocation } from "@lib/constants";

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

      const fid = user.fid ?? DEV_USER_FID;

      const dbUser = await prisma.user.findFirst({
        where: {
          fid,
        },
        select: {
          allocations: {
            select: {
              id: true,
              amount: true,
              isClaimed: true,
              index: true,
              type: true,
              airdrop: {
                select: {
                  id: true,
                  address: true,
                  number: true,
                  startTime: true,
                  endTime: true,
                },
              },
            },
          },
        },
      });

      if (!dbUser) {
        await prisma.user.create({
          data: { address, fid },
        });
      }

      if (!isProduction && address === DEV_USER_ADDRESS.toLowerCase()) {
        const allocations = dbUser?.allocations.find(
          (a) => a.type === AllocationType.POWER_USER,
        )
          ? dbUser?.allocations
          : [...(dbUser?.allocations || []), pendingAllocation];

        return {
          fid: DEV_USER_FID,
          username: "testuser",
          displayName: "Test User",
          pfpUrl:
            "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
          profileBio: "Test bio",
          allocations,
        };
      }

      const allocations = dbUser?.allocations || [];

      // If user has a power badge, add the pending allocation for UX purposes
      // (doesn't get added for real until airdrop is created)
      if (
        user.power_badge &&
        !allocations.find((a) => a.type === AllocationType.POWER_USER)
      ) {
        allocations.push(pendingAllocation);
      }

      return {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        profileBio: user.profile.bio.text,
        allocations,
      };
    } catch (error) {
      // TODO: Log to Sentry
      console.log(error);
      return null;
    }
  });
