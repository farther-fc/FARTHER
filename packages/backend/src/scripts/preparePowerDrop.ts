import {
  CHAIN_ID,
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  ENVIRONMENT,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  POWER_USER_AIRDROP_RATIO,
  WAD_SCALER,
  WARPCAST_API_BASE_URL,
  getMerkleRoot,
  isProduction,
  neynarLimiter,
  tokenAllocations,
} from "@farther/common";
import { v4 as uuidv4 } from "uuid";
import { AllocationType, prisma } from "../prisma";
import { allocateTokens } from "../utils/allocateTokens";
import { writeFile } from "../utils/helpers";
import { airdropSanityCheck } from "./airdropSanityCheck";

const totalAllocation =
  POWER_USER_AIRDROP_RATIO * tokenAllocations.powerUserAirdrops;

async function preparePowerDrop() {
  await airdropSanityCheck({
    totalAllocation,
    ratio: POWER_USER_AIRDROP_RATIO,
  });

  const powerUsers = await getPowerUsers();

  // 3. Upsert users in db
  await prisma.$transaction([
    prisma.user.deleteMany({
      where: {
        id: {
          in: powerUsers.map((u) => u.fid),
        },
      },
    }),
    prisma.user.createMany({
      // Only need fid
      data: powerUsers.map((u) => ({ id: u.fid })),
    }),
  ]);

  // 4. Get all powers users who have not received an airdrop allocation
  const recipients = await prisma.user.findMany({
    where: {
      AND: [
        {
          id: {
            in: powerUsers.map((u) => u.fid),
          },
        },
        {
          allocations: {
            // Each user only gets one power user airdrop
            none: {
              type: AllocationType.POWER_USER,
            },
          },
        },
      ],
    },
    select: {
      id: true,
    },
  });

  // One half == equally distributed. Other half == bonus based on follower count.
  const halfOfTotalWad = (BigInt(totalAllocation) * WAD_SCALER) / BigInt(2);

  const basePerRecipientWad = halfOfTotalWad / BigInt(recipients.length);

  const followerCounts = recipients.map((u) => {
    const followers = powerUsers.find(
      (user) => user.fid === u.id,
    )?.followerCount;
    return {
      fid: u.id,
      followers,
    };
  });

  const bonusAllocations = allocateTokens(
    followerCounts.map((u) => ({ fid: u.fid, followers: u.followers })),
    // Need to scale back down to decimal for this function
    Number(halfOfTotalWad / WAD_SCALER),
  );

  if (bonusAllocations.length !== recipients.length) {
    // Build array of the mismatched fids
    const missingFidsInRecipients = recipients
      .map((r) => r.id)
      .filter((fid) => !bonusAllocations.find((a) => a.fid === fid));

    const missingFidsInBonusAllocations = bonusAllocations
      .map((a) => a.fid)
      .filter((fid) => !recipients.find((r) => r.id === fid));

    throw new Error(
      `Mismatch between recipients and bonus allocations: ${[...missingFidsInRecipients, ...missingFidsInBonusAllocations]}`,
    );
  }

  const recipientsWithAllocations = recipients.map((r, i) => {
    const address = powerUsers.find((u) => u.fid === r.id)?.address;
    return {
      ...r,
      amount:
        basePerRecipientWad +
        BigInt(bonusAllocations[i].allocation) * WAD_SCALER,
      address,
    };
  });

  const recipientsWithoutAddress = recipientsWithAllocations.filter(
    (r) => !r.address,
  );

  if (recipientsWithoutAddress.length > 0) {
    await writeFile(
      `airdrops/${ENVIRONMENT}/${AllocationType.POWER_USER.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}-null-addresses.json`,
      JSON.stringify(
        recipientsWithoutAddress.map((r) => ({
          fid: r.id,
          allocation: r.amount.toString(),
        })),
        null,
        2,
      ),
    );
  }

  const recipientsWithAddress = recipientsWithAllocations.filter(
    (r) => r.address,
  );

  // Throws away any remainder from the division
  const allocationSum = recipientsWithAddress.reduce(
    (sum, r) => sum + r.amount,
    BigInt(0),
  );

  // Create a merkle tree with the above recipients
  const rawLeafData = recipientsWithAddress.map((r, i) => ({
    index: i,
    address: r.address.toLowerCase() as `0x${string}`,
    amount: r.amount.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  // Upsert Airdrop
  const airdrop = await prisma.airdrop.create({
    data: {
      chainId: CHAIN_ID,
      amount: allocationSum.toString(),
      root,
      address: undefined,
      startTime: NEXT_AIRDROP_START_TIME,
      endTime: NEXT_AIRDROP_END_TIME,
    },
  });

  // Add allocations to db
  prisma.allocation.createMany({
    data: recipientsWithAddress.map((r, i) => ({
      id: uuidv4(),
      amount: r.amount.toString(),
      baseAmount: basePerRecipientWad.toString(),
      index: i,
      airdropId: airdrop.id,
      userId: r.id,
      type: AllocationType.POWER_USER,
      address: r.address.toLowerCase(),
    })),
  });

  await writeFile(
    `airdrops/${ENVIRONMENT}/${AllocationType.POWER_USER.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
    JSON.stringify(
      {
        root,
        amount: allocationSum.toString(),
        rawLeafData,
      },
      null,
      2,
    ),
  );

  const sortedAllocations = recipientsWithAllocations
    .map((r) => Number(r.amount / WAD_SCALER))
    .sort((a, b) => a - b);

  console.info({
    root,
    amount: allocationSum,
    minUserAllocation: sortedAllocations[0],
    maxUserAllocation: sortedAllocations[sortedAllocations.length - 1],
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );
}

async function getPowerUsers() {
  // 1. Get power users from Warpcast
  const warpcastResponse = (await (
    await fetch(`${WARPCAST_API_BASE_URL}power-badge-users`)
  ).json()) as { result: { fids: number[] } };

  const powerUserFids = warpcastResponse.result.fids;

  // 2. Get user data from Neynar
  const latestUserData = await neynarLimiter.getUsersByFid(powerUserFids);

  // 2. Filter the ones who have a power badge & verified address
  const data = latestUserData
    .filter(
      (u) =>
        powerUserFids.includes(u.fid) &&
        !!u.verified_addresses.eth_addresses[0],
    )
    .map((u) => ({
      fid: u.fid,
      address: u.verified_addresses.eth_addresses[0].toLowerCase(),
      followerCount: u.follower_count,
    }));

  if (!isProduction) {
    data.push({
      fid: DEV_USER_FID,
      address: DEV_USER_ADDRESS,
      followerCount: 3993,
    });
  }
  return data;
}

preparePowerDrop().catch(console.error);
