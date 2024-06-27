import {
  CHAIN_ID,
  ENVIRONMENT,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  WAD_SCALER,
  getMerkleRoot,
  neynarLimiter,
} from "@farther/common";
import { v4 as uuidv4 } from "uuid";
import { Address } from "viem";
import { AllocationType, prisma } from "../prisma";
import { writeFile } from "../utils/helpers";
import { airdropSanityCheck } from "./airdropSanityCheck";

async function prepareTipsDrop() {
  await airdropSanityCheck({
    date: NEXT_AIRDROP_START_TIME,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  // Get date of last tips drop
  const latestTipsAirdrop = await prisma.airdrop.findFirst({
    where: {
      allocations: {
        some: {
          type: AllocationType.TIPS,
        },
      },
    },
  });

  // Get all users who have received tips that haven't been allocated an airdrop
  const users = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {
          allocationId: null,
          invalidTipReason: null,
        },
      },
    },
    select: {
      id: true,
      tipsReceived: {
        where: {
          invalidTipReason: null,
        },
      },
    },
  });

  const userData = await neynarLimiter.getUsersByFid(users.map((u) => u.id));

  // Create leafs with amount tally for each recipient
  const combinedData = userData.map((u) => ({
    fid: u.fid,
    username: u.username,
    address: u.verified_addresses.eth_addresses[0],
    amount: (
      BigInt(
        users
          .find((user) => user.id === u.fid)
          .tipsReceived.reduce((acc, t) => t.amount + acc, 0),
      ) * WAD_SCALER
    ).toString(),
    tipsReceived: users.find((user) => user.id === u.fid).tipsReceived,
  }));

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

  const leafData = recipientsWithAddress.map((a, i) => ({
    index: i,
    address: a.address as `0x${string}`,
    amount: a.amount,
  }));

  const allocationSum = leafData.reduce(
    (acc, d) => BigInt(d.amount) + acc,
    BigInt(0),
  );

  const root = getMerkleRoot(leafData);

  await prisma.$transaction(async (tx) => {
    // Create airdrop
    const airdrop = await tx.airdrop.create({
      data: {
        chainId: CHAIN_ID,
        amount: allocationSum.toString(),
        root,
        startTime: NEXT_AIRDROP_START_TIME,
        endTime: NEXT_AIRDROP_END_TIME,
      },
    });

    for (const recipient of recipientsWithAddress) {
      await tx.allocation.create({
        data: {
          id: uuidv4(),
          airdropId: airdrop.id,
          userId: recipient.fid,
          address: recipient.address as Address,
          amount: recipient.amount,
          type: AllocationType.TIPS,
          tips: {
            connect: recipient.tipsReceived.map((t) => ({ hash: t.hash })),
          },
        },
      });
    }

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
          leafData,
        },
        null,
        2,
      ),
    );
  });
}

prepareTipsDrop().catch(console.error);
