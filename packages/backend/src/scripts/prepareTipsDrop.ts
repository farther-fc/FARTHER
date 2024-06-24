import {
  ENVIRONMENT,
  NEXT_AIRDROP_START_TIME,
  getMerkleRoot,
  neynarLimiter,
} from "@farther/common";
import { AllocationType, prisma } from "../prisma";
import { writeFile } from "../utils/helpers";

async function prepareTipsDrop() {
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

  const lastDropDate = latestTipsAirdrop?.createdAt || new Date(0);

  // Get all users who have received tips since last drop
  const users = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {
          createdAt: {
            gt: lastDropDate,
          },
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
  const combinedData = userData
    .map((u) => ({
      fid: u.fid,
      username: u.username,
      address: u.verified_addresses.eth_addresses[0],
      amount: users
        .find((user) => user.id === u.fid)
        .tipsReceived.reduce((acc, t) => t.amount + acc, 0),
    }))
    .filter((leaf) => !!leaf.address);

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
          amount: a.amount.toString(),
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
    amount: BigInt(a.amount * 10 ** 18).toString(),
  }));

  const root = getMerkleRoot(leafData);

  await prisma.$transaction(async (tx) => {});
}

prepareTipsDrop().catch(console.error);
