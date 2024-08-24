import {
  CHAIN_ID,
  ENVIRONMENT,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  WAD_SCALER,
  getMerkleRoot,
  neynar,
} from "@farther/common";
import { createObjectCsvWriter } from "csv-writer";
import { v4 as uuidv4 } from "uuid";
import { Address } from "viem";
import { writeFile } from "../lib/utils/helpers";
import { AllocationType, prisma } from "../prisma";
import { airdropSanityCheck } from "./airdropSanityCheck";

async function prepareTipsDrop() {
  await airdropSanityCheck({
    date: NEXT_AIRDROP_START_TIME,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  const latestTipsAirdrop = await prisma.airdrop.findFirst({
    where: {
      allocations: {
        some: {
          type: AllocationType.TIPS,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });

  const lastAirdropSnapshotTime = latestTipsAirdrop?.createdAt || new Date(0);

  // Get all users who have received tips that haven't been allocated an airdrop
  const users = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {
          allocationId: null,
          invalidTipReason: null,
          createdAt: {
            gte: lastAirdropSnapshotTime,
          },
        },
      },
    },
    select: {
      id: true,
      tipsReceived: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: lastAirdropSnapshotTime,
          },
        },
      },
    },
  });

  const userData = await neynar.getUsersByFid(users.map((u) => u.id));

  // Create leafs with amount tally for each recipient
  const combinedData = userData.map((u) => {
    const user = users.find((user) => user.id === u.fid);

    if (!user) {
      throw new Error(`No user found for fid: ${u.fid}`);
    }

    return {
      fid: u.fid,
      username: u.username,
      // TODO: figure out if this should be selecting using different criteria rather than just the first in the list
      address: u.verified_addresses.eth_addresses[0],
      amount: (
        BigInt(
          Math.round(user.tipsReceived.reduce((acc, t) => t.amount + acc, 0)),
        ) * WAD_SCALER
      ).toString(),
      tipsReceived: user.tipsReceived,
    };
  });

  const recipientsWithAddress = combinedData.filter((a) => a.address);
  const recipientsWithoutAddress = combinedData.filter((a) => !a.address);

  if (recipientsWithoutAddress.length > 0) {
    console.info(
      `Found ${recipientsWithoutAddress.length} recipients without an address`,
    );
    await writeFile(
      `airdrops/${ENVIRONMENT}/${AllocationType.TIPS.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}-null-addresses.json`,
      JSON.stringify(
        recipientsWithoutAddress.map((a) => ({
          fid: a.fid,
          amount: a.amount,
          username: a.username,
        })),
        null,
        2,
      ),
    );
  }

  const leafsWithFids = recipientsWithAddress.map((a, i) => ({
    fid: a.fid,
    index: i,
    address: a.address as `0x${string}`,
    amount: a.amount,
  }));

  const leafs = leafsWithFids.map(({ fid, ...leafData }) => leafData);

  const allocationSum = leafsWithFids.reduce(
    (acc, d) => BigInt(d.amount) + acc,
    BigInt(0),
  );

  const root = getMerkleRoot(leafs);

  const airdrop = await prisma.airdrop.create({
    data: {
      chainId: CHAIN_ID,
      amount: allocationSum.toString(),
      root,
      startTime: NEXT_AIRDROP_START_TIME,
      endTime: NEXT_AIRDROP_END_TIME,
    },
  });

  await prisma.$transaction(
    leafsWithFids.map((leaf) => {
      const recipient = recipientsWithAddress.find((r) => r.fid === leaf.fid);

      if (!recipient) {
        throw new Error(`Recipient not found for leaf with fid: ${leaf.fid}`);
      }

      return prisma.allocation.create({
        data: {
          id: uuidv4(),
          airdropId: airdrop.id,
          userId: leaf.fid,
          address: leaf.address as Address,
          amount: leaf.amount,
          index: leaf.index,
          type: AllocationType.TIPS,
          tips: {
            connect: recipient.tipsReceived.map((t) => ({ hash: t.hash })),
          },
        },
      });
    }),
  );

  const sortedAllocations = recipientsWithAddress
    .map((r) => Number(BigInt(r.amount) / WAD_SCALER))
    .sort((a, b) => a - b);

  await writeFile(
    `airdrops/${ENVIRONMENT}/${AllocationType.TIPS.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
    JSON.stringify(
      {
        root,
        amount: allocationSum.toString(),
        numberOfRecipients: recipientsWithAddress.length,
        minUserAllocation: sortedAllocations[0],
        maxUserAllocation: sortedAllocations[sortedAllocations.length - 1],
        startTime: Math.round(NEXT_AIRDROP_START_TIME.getTime() / 1000),
        rawLeafData: leafs,
      },
      null,
      2,
    ),
  );

  const csvWriter = createObjectCsvWriter({
    path: `airdrops/${ENVIRONMENT}/${AllocationType.TIPS.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.csv`,
    header: [
      { id: "address", title: "address" },
      { id: "amount", title: "amount" },
    ],
  });

  await csvWriter.writeRecords(leafs);

  console.info({
    root,
    amount: allocationSum.toString(),
    numberOfRecipients: recipientsWithAddress.length,
    minUserAllocation: sortedAllocations[0],
    maxUserAllocation: sortedAllocations[sortedAllocations.length - 1],
    startTime: Math.round(NEXT_AIRDROP_START_TIME.getTime() / 1000),
  });
}

prepareTipsDrop().catch(console.error);
