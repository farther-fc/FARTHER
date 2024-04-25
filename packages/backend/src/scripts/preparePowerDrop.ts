import {
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  GIGAMESH_FID,
  GIGAMESH_ADDRESS,
  WAD_SCALER,
  WARPCAST_API_BASE_URL,
  isProduction,
  neynarLimiter,
  powerUserAirdropConfig,
  tokenAllocations,
  NEXT_AIRDROP_START_TIME,
  NEXT_AIRDROP_END_TIME,
} from "@farther/common";
import { AllocationType, prisma } from "../prisma";
import { getMerkleRoot } from "@farther/common";
import { writeFile } from "../utils/helpers";
import { ENVIRONMENT, CHAIN_ID } from "@farther/common";
import { allocateTokens } from "../utils/allocateTokens";

async function preparePowerDrop() {
  const powerUsers = await getPowerUsers();

  // 3. Upsert users in db
  await prisma.$transaction([
    prisma.user.deleteMany({
      where: {
        fid: {
          in: powerUsers.map((u) => u.fid),
        },
      },
    }),
    prisma.user.createMany({
      // Only need fid
      data: powerUsers.map((u) => ({ fid: u.fid })),
    }),
  ]);

  // 4. Get all powers users who have not received an airdrop allocation
  const recipients = await prisma.user.findMany({
    where: {
      fid: {
        in: powerUsers.map((u) => u.fid),
      },
      allocations: {
        // Each user only gets one power user airdrop
        none: {
          type: AllocationType.POWER_USER,
        },
      },
    },
    select: {
      id: true,
      fid: true,
    },
  });

  const totalAllocation =
    powerUserAirdropConfig.RATIO * tokenAllocations.powerUserAirdrops;

  // One half == equally distributed. Other half == bonus based on follower count.
  const halfOfTotalWad = (BigInt(totalAllocation) * WAD_SCALER) / BigInt(2);

  const basePerRecipientWad = halfOfTotalWad / BigInt(recipients.length);

  const followerCounts = recipients.map((u) => {
    const followers = powerUsers.find(
      (user) => user.fid === u.fid,
    )?.followerCount;
    return {
      fid: u.fid,
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
      .map((r) => r.fid)
      .filter((fid) => !bonusAllocations.find((a) => a.fid === fid));

    const missingFidsInBonusAllocations = bonusAllocations
      .map((a) => a.fid)
      .filter((fid) => !recipients.find((r) => r.fid === fid));

    throw new Error(
      `Mismatch between recipients and bonus allocations: ${[...missingFidsInRecipients, ...missingFidsInBonusAllocations]}`,
    );
  }

  const recipientsWithAllocations = recipients.map((r, i) => {
    const address = powerUsers.find((u) => u.fid === r.fid)?.address;
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
      `airdrops/${ENVIRONMENT}/${AllocationType.POWER_USER.toLowerCase()}-${powerUserAirdropConfig.NUMBER}-null-addresses.json`,
      JSON.stringify(
        recipientsWithoutAddress.map((r) => ({
          fid: r.fid,
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

  const airdropData = {
    number: powerUserAirdropConfig.NUMBER,
    chainId: CHAIN_ID,
    amount: allocationSum.toString(),
    root,
    address: undefined,
    startTime: NEXT_AIRDROP_START_TIME,
    endTime: NEXT_AIRDROP_END_TIME,
  };

  // Upsert Airdrop
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
      data: recipientsWithAddress.map((r, i) => ({
        amount: r.amount.toString(),
        index: i,
        airdropId: airdrop.id,
        userId: r.id,
        type: AllocationType.POWER_USER,
        address: r.address.toLowerCase(),
      })),
    }),
  ]);

  await writeFile(
    `airdrops/${ENVIRONMENT}/${AllocationType.POWER_USER.toLowerCase()}-${powerUserAirdropConfig.NUMBER}.json`,
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

  console.log({
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
  if (!isProduction) {
    return [
      {
        fid: DEV_USER_FID,
        address: DEV_USER_ADDRESS,
        followerCount: 3993,
      },
      {
        fid: GIGAMESH_FID,
        address: GIGAMESH_ADDRESS,
        followerCount: 65000,
      },
    ];
  }

  // 1. Get power users from Warpcast
  const warpcastResponse = (await (
    await fetch(`${WARPCAST_API_BASE_URL}power-badge-users`)
  ).json()) as { result: { fids: number[] } };

  const powerUserFids = warpcastResponse.result.fids;

  // 2. Get user data from Neynar
  const latestUserData = await neynarLimiter.getUsersByFid(powerUserFids);

  // 2. Filter the ones who have a power badge & verified address
  const data = latestUserData
    .filter((u) => !!u.power_badge && !!u.verified_addresses.eth_addresses[0])
    .map((u) => ({
      fid: u.fid,
      address: u.verified_addresses.eth_addresses[0].toLowerCase(),
      followerCount: u.follower_count,
    }));

  return data;
}

preparePowerDrop().catch(console.error);
