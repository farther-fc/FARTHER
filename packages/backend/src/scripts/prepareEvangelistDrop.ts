import {
  ANVIL_AIRDROP_ADDRESS,
  neynarLimiter,
  isProduction,
  DEV_USER_FID,
  DEV_USER_ADDRESS,
  GIGAMESH_FID,
  GIGAMESH_ADDRESS,
  NETWORK,
  NEXT_AIRDROP_START_TIME,
  NEXT_AIRDROP_END_TIME,
} from "@farther/common";
import { AllocationType, prisma } from "../prisma";
import { getMerkleRoot } from "@farther/common";
import { writeFile } from "../utils/helpers";
import { ENVIRONMENT, CHAIN_ID } from "@farther/common";

// After calling it, deploy the airdrop contract with the merkle root, manually add Airdrop.address & Airdrop.root in the DB,
// update the config with the next airdrop's values, and restart the cron.
async function prepareEvangelistDrop() {
  // Get all evangelists with pending rewards
  const dbRecipients = await prisma.user.findMany({
    where: {
      allocations: {
        some: {
          type: AllocationType.EVANGELIST,
          // No airdrop ID == no airdrop deployed yet
          airdropId: null,
        },
      },
    },
    select: {
      id: true,
      fid: true,
      allocations: true,
    },
  });

  for (const recipient of dbRecipients) {
    if (recipient.allocations.length > 1) {
      throw new Error(`User ${recipient.id} has multiple allocations`);
    }
  }

  const recipients = dbRecipients.map(({ allocations, ...rest }) => ({
    ...rest,
    allocation: allocations[0],
  }));

  // Get their addresses from Neynar
  const userData = await getUserData(recipients.map((r) => r.fid));

  const combinedData = recipients.map((r) => ({
    ...r,
    address: userData.find((u) => u.fid === r.fid)?.address,
  }));

  const recipientsWithAddress = combinedData.filter((r) => r.address);
  const recipientsWithoutAddress = combinedData.filter((r) => !r.address);

  if (recipientsWithoutAddress.length > 0) {
    await writeFile(
      `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME}-null-addresses.json`,
      JSON.stringify(
        recipientsWithoutAddress.map((r) => ({
          fid: r.fid,
          amount: r.allocation.amount.toString(),
        })),
        null,
        2,
      ),
    );
  }
  const allocationSum = recipientsWithAddress
    .map((r) => r.allocation)
    .reduce((acc, a) => acc + BigInt(a.amount), BigInt(0));

  // Create a merkle tree with the above recipients
  const rawLeafData = recipientsWithAddress.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: r.allocation.amount.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  // Create Airdrop
  const airdrop = await prisma.airdrop.create({
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

  // Add allocations to db
  await prisma.$transaction([
    prisma.allocation.deleteMany({
      where: {
        airdropId: airdrop.id,
      },
    }),
    prisma.allocation.createMany({
      data: recipientsWithAddress.map((r, i) => ({
        amount: r.allocation.amount.toString(),
        index: i,
        airdropId: airdrop.id,
        userId: r.id,
        type: AllocationType.EVANGELIST,
        address: r.address.toLowerCase(),
      })),
    }),
  ]);

  await writeFile(
    `airdrops/${NETWORK}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME}.json`,
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

  console.log({
    root,
    amount: allocationSum,
    recipients: recipientsWithAddress.length,
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );
}

async function getUserData(fids: number[]) {
  if (isProduction) {
    const userData = await neynarLimiter.getUsersByFid(fids);
    return userData.map((u) => ({
      fid: u.fid,
      address: u.verified_addresses.eth_addresses[0],
    }));
  }

  console.log(fids);

  return fids.map((fid) => {
    if (fid === DEV_USER_FID) {
      return {
        fid,
        address: DEV_USER_ADDRESS,
      };
    }
    if (fid === GIGAMESH_FID) {
      return {
        fid,
        address: GIGAMESH_ADDRESS,
      };
    }
    throw new Error(`No address found for fid: ${fid}`);
  });
}

prepareEvangelistDrop().catch(console.error);
