import { prisma } from "../../backend/src/prisma";
import { publicProcedure } from "server/trpc";
import { apiSchemas } from "@lib/types/apiSchemas";
import { neynarClient } from "@common/neynar";
import { ENVIRONMENT, isProduction } from "@common/env";
import { TEST_USER_ADDRESS, TEST_USER_FID } from "@common/constants";
import { TRPCError } from "@trpc/server";

export const getUser = publicProcedure
  .input(apiSchemas.getUser.input)
  .query(async (opts) => {
    const { address } = opts.input;
    try {
      // Get user data from neynar
      const response = await neynarClient.fetchBulkUsersByEthereumAddress([
        opts.input.address,
      ]);

      // Neynar returns weird data structure
      const [user] = response[address.toLowerCase()]
        ? response[address.toLowerCase()]
        : [];

      // In prod, we know that the user is on Neynar. Otherwise we pretend they are.
      if (!user && isProduction) {
        return null;
      }

      const dbUser = await prisma.user.findFirst({
        where: {
          address: opts.input.address.toLowerCase(),
        },
        select: {
          allocations: {
            select: {
              id: true,
              amount: true,
              isClaimed: true,
              index: true,
              airdrop: {
                select: { id: true, type: true, address: true, number: true },
              },
            },
          },
          address: true,
        },
      });

      if (!isProduction) {
        if (
          opts.input.address.toLowerCase() !== TEST_USER_ADDRESS.toLowerCase()
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Connect with ${TEST_USER_ADDRESS} to see the test user.`,
          });
        }
        return {
          fid: TEST_USER_FID,
          username: "testuser",
          displayName: "Test User",
          pfpUrl:
            "https://wrpcd.net/cdn-cgi/image/fit=contain,f=auto,w=168/https%3A%2F%2Fi.imgur.com%2F3hrPNK8.jpg",
          profileBio: "Test bio",
          connectedAddress: TEST_USER_ADDRESS.toLowerCase(),
          allocations: dbUser?.allocations,
        };
      }

      return {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfpUrl: user.pfp_url,
        profileBio: user.profile.bio.text,
        connectedAddress: dbUser?.address,
        verifiedAddresses: user.verified_addresses.eth_addresses,
        allocations: dbUser?.allocations,
      };
    } catch (error) {
      // Log to Sentry
      console.log(error);
      return null;
    }
  });
