import {
  ANVIL_AIRDROP_ADDRESS,
  CHAIN_ID,
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  ENVIRONMENT,
  GIGAMESH_ADDRESS,
  GIGAMESH_FID,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  WAD_SCALER,
  getMerkleRoot,
  isProduction,
  neynarLimiter,
} from "@farther/common";
import { writeFile } from "../lib/utils/helpers";
import { AllocationType, prisma } from "../prisma";
import { airdropSanityCheck } from "./airdropSanityCheck";

// After calling it, deploy the airdrop contract with the merkle root, manually add Airdrop.address & Airdrop.root in the DB,
// update the config with the next airdrop's values, and restart the cron.
async function prepareEvangelistDrop() {
  await airdropSanityCheck({
    date: NEXT_AIRDROP_START_TIME,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  // Get all pending evangelist allocations
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.EVANGELIST,
      // No airdrop ID == no airdrop deployed yet
      airdropId: null,
      isInvalidated: false,
    },
    include: {
      user: true,
    },
  });

  // Check for duplicate allocations for a given user
  for (const allocation of allocations) {
    const duplicates = allocations.filter(
      (a) => a.userId === allocation.userId,
    );
    if (duplicates.length > 1) {
      throw new Error(
        `Duplicate allocations found for user ${allocation.userId}`,
      );
    }
  }

  // Get their addresses from Neynar
  const userData = await getUserData(allocations.map((a) => a.user.id));

  const combinedData = allocations.map((a) => {
    const user = userData.find((u) => u.fid === a.user.id);

    if (!user) {
      throw new Error(`No user found for fid: ${a.user.id}`);
    }
    return {
      ...a,
      address: user.address,
      powerBadge: user.powerBadge,
      username: user.username,
    };
  });

  const allocationsWithAddress =
    await filterAllocationsWithAddress(combinedData);
  const allocationsWithPowerBadge = await filterPowerEvangelists(
    allocationsWithAddress,
  );

  const allocationSum = allocationsWithPowerBadge.reduce(
    (acc, a) => acc + BigInt(a.amount),
    BigInt(0),
  );

  // Create a merkle tree with the above recipients
  const rawLeafData = allocationsWithPowerBadge.map((a, i) => ({
    index: i,
    address: a.address as `0x${string}`,
    amount: a.amount.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  await prisma.$transaction(
    async (tx) => {
      // Create Airdrop
      const airdrop = await tx.airdrop.create({
        data: {
          chainId: CHAIN_ID,
          amount: allocationSum.toString(),
          root,
          address:
            ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
          startTime: NEXT_AIRDROP_START_TIME,
          endTime: NEXT_AIRDROP_END_TIME,
        },
      });

      // Update allocations with airdrop ID and index
      let index = 0;
      for (const allocation of allocationsWithPowerBadge) {
        await tx.allocation.update({
          where: {
            id: allocation.id,
          },
          data: {
            airdropId: airdrop.id,
            index: index++,
            address: allocation.address.toLowerCase(),
          },
        });
      }

      await writeFile(
        `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
        JSON.stringify(
          {
            root,
            amount: allocationSum.toString(),
            ...getMetaData(),
            rawLeafData,
          },
          null,
          2,
        ),
      );
    },
    {
      timeout: 120_000,
    },
  );

  console.info({
    root,
    amount: allocationSum,
    ...getMetaData(),
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );

  function getMetaData() {
    const sorted = allocationsWithPowerBadge.sort((a, b) => {
      if (BigInt(a.amount) < BigInt(b.amount)) {
        return 1;
      } else if (BigInt(a.amount) > BigInt(b.amount)) {
        return -1;
      } else {
        return 0;
      }
    });

    return {
      numberOfRecipients: allocationsWithPowerBadge.length,
      minUserAllocation: Number(
        BigInt(sorted[sorted.length - 1].amount) / WAD_SCALER,
      ),
      maxUserAllocation: Number(BigInt(sorted[0].amount) / WAD_SCALER),
      startTime: Math.round(NEXT_AIRDROP_START_TIME.getTime() / 1000),
    };
  }

  async function filterAllocationsWithAddress(data: typeof combinedData) {
    const allocationsWithAddress = data.filter((a) => a.address);
    const allocationsWithoutAddress = data.filter((a) => !a.address);

    if (allocationsWithoutAddress.length > 0) {
      console.info(
        `Found ${allocationsWithoutAddress.length} allocations without an address`,
      );
      await writeFile(
        `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}-null-addresses.json`,
        JSON.stringify(
          allocationsWithoutAddress.map((a) => ({
            fid: a.user.id,
            amount: a.amount.toString(),
            username: a.username,
          })),
          null,
          2,
        ),
      );
    }

    return allocationsWithAddress;
  }

  async function filterPowerEvangelists(data: typeof allocationsWithAddress) {
    const allocationsWithPowerBadge = data.filter((u) => !!u.powerBadge);
    const allocationsWithoutPowerBadge = data.filter((u) => !u.powerBadge);

    console.info(
      `Found ${allocationsWithPowerBadge.length} allocations with power badge`,
    );

    if (allocationsWithoutPowerBadge.length > 0) {
      console.info(
        `Found ${allocationsWithoutPowerBadge.length} allocations without a power badge`,
      );
      await writeFile(
        `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}-no-power-badge.json`,
        JSON.stringify(
          allocationsWithoutPowerBadge.map((a) => ({
            fid: a.user.id,
            username: a.username,
            amount: a.amount,
            address: a.address,
          })),
          null,
          2,
        ),
      );
    }

    return allocationsWithPowerBadge;
  }
}

async function getUserData(fids: number[]) {
  if (isProduction) {
    const userData = await neynarLimiter.getUsersByFid(fids);

    return userData.map((u) => ({
      fid: u.fid,
      address: u.verified_addresses.eth_addresses[0],
      powerBadge: u.power_badge,
      username: u.username,
    }));
  }

  return fids.map((fid) => {
    if (fid === DEV_USER_FID) {
      return {
        fid,
        address: DEV_USER_ADDRESS,
        powerBadge: true,
        username: "dev-user",
      };
    }
    if (fid === GIGAMESH_FID) {
      return {
        fid,
        address: GIGAMESH_ADDRESS,
        powerBadge: true,
        username: "gigamesh",
      };
    }
    throw new Error(`No address found for fid: ${fid}`);
  });
}

prepareEvangelistDrop().catch(console.error);
