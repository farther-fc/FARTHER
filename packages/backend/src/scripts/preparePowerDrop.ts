import {
  ANVIL_AIRDROP_ADDRESS,
  DEV_USER_FID,
  NeynarUser,
  WAD_SCALER,
  isProduction,
  neynarLimiter,
  powerUserAirdropConfig,
  tokenAllocations,
} from "@farther/common";
import { AllocationType, User, prisma } from "../prisma";
import { getMerkleRoot } from "@farther/common";
import { writeFile } from "../utils/helpers";
import { ENVIRONMENT, CHAIN_ID } from "@farther/common";
import { allocateTokens } from "../utils/allocateTokens";
import { updateVerifiedAddresses } from "../utils/updateVerifiedAddresses";

// Prior to calling it, the updatePowerUsers cron should be paused (which effectively becomes the snapshot time)
// After calling it, deploy the airdrop contract with the merkle root, manually update Airdrop.address & Airdrop.root in the DB,
// update the config with the next airdrop's values, and restart the cron.
async function preparePowerDrop() {
  // Get all powers users who have not received an airdrop allocation but do have an address
  const usersWithAllocations = await prisma.user.findMany({
    where: {
      address: {
        not: null,
      },
      allocations: {
        // Each user only gets one power user airdrop
        none: {
          type: AllocationType.POWER_USER,
        },
      },
    },
  });

  // Update the verified addresses of these users in case they recently removed the one being stored
  const recipients = await updateVerifiedAddresses(usersWithAllocations);

  // Sanity check
  if (usersWithAllocations.length !== recipients.length) {
    throw new Error("Mismatch between usersWithAllocations and recipients");
  }

  const totalAllocation =
    powerUserAirdropConfig.RATIO * tokenAllocations.powerUserAirdrops;

  // One half == equally distributed. Other half == bonus based on follower count.
  const halfOfTotalWad = (BigInt(totalAllocation) * WAD_SCALER) / BigInt(2);

  const basePerRecipientWad = halfOfTotalWad / BigInt(recipients.length);

  const latestUserData: NeynarUser[] = await neynarLimiter.getUsersByFid(
    recipients.map((r) => r.fid),
  );

  const followerCounts = latestUserData.map((u) => ({
    fid: u.fid,
    followers: u.follower_count,
  }));

  // Add test user (pretending this user is on Farcaster)
  if (!isProduction) {
    followerCounts.push({
      fid: DEV_USER_FID,
      followers: 3993,
    });
  }

  if (followerCounts.length !== recipients.length) {
    // Find the mismatches
    const missingFids = recipients
      .map((r) => r.fid)
      .filter((fid) => !followerCounts.some((u) => u.fid === fid));

    throw new Error(`Missing data for fids: ${missingFids.join(", ")}`);
  }

  const bonusAllocations = allocateTokens(
    followerCounts.map((u) => ({ fid: u.fid, followers: u.followers })),
    // Need to scale back down to decimal for this function
    Number(halfOfTotalWad / WAD_SCALER),
  );

  const recipientsWithAllocations = recipients.map((r, i) => ({
    ...r,
    allocation:
      basePerRecipientWad + BigInt(bonusAllocations[i].allocation) * WAD_SCALER,
  }));

  // Throws away any remainder from the division
  const trueTotalAllocation = recipientsWithAllocations.reduce(
    (sum, r) => sum + r.allocation,
    BigInt(0),
  );

  // Create a merkle tree with the above recipients
  const rawLeafData = recipientsWithAllocations.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: r.allocation.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  const airdropData = {
    number: powerUserAirdropConfig.NUMBER,
    chainId: CHAIN_ID,
    amount: trueTotalAllocation.toString(),
    root,
    address: ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
  };

  // Create Airdrop
  const airdrop = await prisma.airdrop.upsert({
    where: { number: powerUserAirdropConfig.NUMBER, chainId: CHAIN_ID },
    create: airdropData,
    update: airdropData,
  });

  // Add allocations to db
  await prisma.$transaction([
    prisma.allocation.deleteMany({
      where: {
        airdropId: airdrop.id,
      },
    }),
    prisma.allocation.createMany({
      data: recipientsWithAllocations.map((recipient, i) => ({
        amount: recipient.allocation.toString(),
        index: i,
        airdropId: airdrop.id,
        userId: recipient.id,
        type: AllocationType.POWER_USER,
      })),
    }),
  ]);

  await writeFile(
    `airdrops/${ENVIRONMENT}/power-user-airdrop-${powerUserAirdropConfig.NUMBER}.json`,
    JSON.stringify(
      {
        root,
        rawLeafData,
      },
      null,
      2,
    ),
  );

  const sortedAllocations = recipientsWithAllocations
    .map((r) => Number(r.allocation / WAD_SCALER))
    .sort((a, b) => a - b);

  console.log(sortedAllocations);

  console.log({
    root,
    totalAllocation,
    trueTotalAllocation,
    minUserAllocation: sortedAllocations[0],
    maxUserAllocation: sortedAllocations[sortedAllocations.length - 1],
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );
}

preparePowerDrop().catch(console.error);
