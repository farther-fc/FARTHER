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

    let fid: number;

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

      fid = user.fid;

      const dbUser = await getDbUserByFid(fid);

      if (!dbUser) {
        await prisma.user.create({
          data: { fid },
        });
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
    } catch (error: any) {
      if (error.response.statusText === "Not Found") {
        // Return test user if in dev/staging
        if (!isProduction && address === DEV_USER_ADDRESS.toLowerCase()) {
          const dbUser = await getDbUserByFid(DEV_USER_FID);

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

        return null;
      }
      // TODO: Log to Sentry?
      console.log(error);
    }
  });

function getDbUserByFid(fid: number) {
  return prisma.user.findFirst({
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
}
