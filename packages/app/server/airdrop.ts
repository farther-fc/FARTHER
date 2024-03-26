import { chunk } from "underscore";
import {
  neynarClient,
  neynarScheduler,
  NEYNAR_DATA_SIZE_LIMIT,
} from "@common/neynar";
import { prisma } from "@lib/prisma";
import { adminProcedure } from "server/trpc";

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

  // Check Neynar to see if ^those users have connected wallet since last check
  const fids = users.map((u) => u.fid);
  const fidChunks = chunk(fids, NEYNAR_DATA_SIZE_LIMIT);

  const bulkUsersArray = await Promise.all(
    fidChunks.map((fids) =>
      neynarScheduler.schedule(() => neynarClient.fetchBulkUsers(fids)),
    ),
  );

  const usersWithConnectedAddress = bulkUsersArray
    .map((data) => data.users)
    .flat()
    .filter((u) => u.verified_addresses.eth_addresses.length > 0);

  // Check airdrop contract logs to see if they've claimed
  // Update database
}

// Calculate allocation per user for the *current* airdrop (new power users)
async function prepareNewRecipients() {
  console.log("Preparing new recipients");
  // Fetch all power users Warpcast API.
  // Get users from DB who have been allocated airdrop tokens (claimed or unclaimed). Remove the matches from the previous step.
  // Check Neynar to see if ^those users have connected wallet
  // If any users are in filtered list...
  // Upsert Airdrop
  // Upsert User records (connected wallet address)
  // Create Allocation records
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
