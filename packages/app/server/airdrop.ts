import fetch from "node-fetch";
import { chunk } from "underscore";
import {
  neynarClient,
  neynarScheduler,
  NEYNAR_DATA_SIZE_LIMIT,
} from "@common/neynar";
import {
  TOTAL_AIRDROP_SUPPLY,
  WARPCAST_API_BASE_URL,
  airdropConfig,
} from "@common/constants";
import { prisma } from "@lib/prisma";
import { adminProcedure } from "server/trpc";
import { defaultChainId } from "@common/env";

async function updatePendingRecipients() {
  console.log("Updating pending recipients");

  // Fetch users from DB with unclaimed airdrop tokens
  const users = await prisma.user.findMany({
    where: {
      airdropAllocations: {
        some: {
          isClaimed: false,
        },
      },
    },
  });

  console.log("Pending recipients:", users.length);

  // Check Neynar to see if ^those users have connected wallet since last check
  const fids = users.map((u) => u.fid);
  const usersWithConnectedAddress = await getUsersWithConnectedAddress(fids);

  console.log(
    "Pending recipients who recently connected wallet:",
    usersWithConnectedAddress.length,
  );

  // Update database
  await prisma.$transaction(
    usersWithConnectedAddress.map((u) => {
      return prisma.user.update({
        where: { fid: u.fid },
        data: { address: u.verified_addresses.eth_addresses[0] },
      });
    }),
  );

  console.log(
    "Updated database with pending recipients who have connected addresses\n\n",
  );
}

// Calculate allocation per user for the *current* airdrop (new power users)
async function prepareNewRecipients() {
  console.log("Preparing new recipients");
  // Fetch all power users Warpcast API.

  const warpcastResponse = (await (
    await fetch(`${WARPCAST_API_BASE_URL}power-badge-users`)
  ).json()) as { result: { fids: number[] } };

  const powerUserFids = warpcastResponse.result.fids;

  console.log("Warpcast power users:", powerUserFids.length);

  // Get users from DB who have been allocated airdrop tokens (claimed or unclaimed). Remove the matches from the previous step.
  const users = await prisma.user.findMany({
    where: {
      airdropAllocations: {
        some: {},
      },
    },
  });

  console.log("Users with airdrop allocations:", users.length);

  // Check Neynar to see if ^those users have connected wallet
  const usersWithConnectedAddress = await getUsersWithConnectedAddress(
    users.map((u) => u.fid),
  );

  if (usersWithConnectedAddress.length === 0) {
    console.log("No users with connected addresses");
    return;
  }

  // Upsert Airdrop
  const airdrop = await prisma.airdrop.upsert({
    where: { version: airdropConfig.VERSION, chainId: defaultChainId },
    create: {
      version: airdropConfig.VERSION,
      chainId: defaultChainId,
      amount: airdropConfig.RATIO * TOTAL_AIRDROP_SUPPLY,
    },
    update: {},
  });

  // Upsert User records (connected wallet address)
  // Create Allocation records
  await prisma.$transaction(
    usersWithConnectedAddress.map((u) => {
      return prisma.user.update({
        where: { fid: u.fid },
        data: {
          address: u.verified_addresses.eth_addresses[0],
          airdropAllocations: {
            create: {
              airdropId: airdrop.id,
            },
          },
        },
      });
    }),
  );
}

async function getUsersWithConnectedAddress(fids: number[]) {
  const fidChunks = chunk(fids, NEYNAR_DATA_SIZE_LIMIT);

  const bulkUsersArray = await Promise.all(
    fidChunks.map((fids) =>
      neynarScheduler.schedule(() => neynarClient.fetchBulkUsers(fids)),
    ),
  );

  return bulkUsersArray
    .map((data) => data.users)
    .flat()
    .filter((u) => u.verified_addresses.eth_addresses.length > 0);
}

// TODO: Put this on an hourly cron
export const updateAirdropRecipients = adminProcedure.mutation(async () => {
  try {
    await updatePendingRecipients();
    await prepareNewRecipients();
  } catch (e) {
    console.error(e);
  }
});
