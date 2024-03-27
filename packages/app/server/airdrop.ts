import fetch from "node-fetch";
import { chunk } from "underscore";
import { neynar } from "@common/neynar";
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

  // Fetch users from DB with an airdrop allocation but no connected wallet address
  const users = await prisma.user.findMany({
    where: {
      address: null,
      airdropAllocations: {
        some: {},
      },
    },
  });

  console.log("Pending recipients:", users.length);

  // Check Neynar to see if ^those users have connected wallet since last check
  const fids = users.map((u) => u.fid);
  const usersWithConnectedAddress = (await neynar.getUsers(fids)).filter(
    (u) => u.verified_addresses.eth_addresses.length > 0,
  );

  console.log(
    "Pending recipients who recently connected wallet:",
    usersWithConnectedAddress.length,
  );

  if (usersWithConnectedAddress.length === 0) {
    return;
  }

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
    `Updated database with pending recipients who have connected addresses. Fids: ${usersWithConnectedAddress.map((u) => u.fid)}`,
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

  // Get users from DB who have been allocated airdrop tokens (claimed or unclaimed.
  const usersWithAllocation = await prisma.user.findMany({
    where: {
      airdropAllocations: {
        some: {},
      },
    },
  });

  // Filter power users who already have an allocation
  const filteredFids = powerUserFids.filter(
    (fid) => !usersWithAllocation.some((u) => u.fid === fid),
  );

  console.log("New power users:", filteredFids.length);

  if (filteredFids.length === 0) {
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

  console.log("Airdrop:", airdrop);

  // Get data from Neynar
  const users = await neynar.getUsers(filteredFids);

  // Upsert User records (connected wallet address)
  // Create Allocation records
  await prisma.$transaction(
    users.map((u) => {
      const data = {
        fid: u.fid,
        address: u.verified_addresses.eth_addresses.length
          ? u.verified_addresses.eth_addresses[0]
          : null,
        airdropAllocations: {
          create: {
            airdropId: airdrop.id,
          },
        },
      };
      return prisma.user.upsert({
        where: { fid: u.fid },
        create: data,
        update: data,
      });
    }),
  );
}

// TODO: Put this on an hourly cron
export const updateAirdropRecipients = adminProcedure.mutation(async () => {
  try {
    await updatePendingRecipients();
    await prepareNewRecipients();
    console.log("done");
  } catch (e) {
    console.error(e);
  }
});
