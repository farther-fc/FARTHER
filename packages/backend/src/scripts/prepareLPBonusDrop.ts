import {
  ANVIL_AIRDROP_ADDRESS,
  CHAIN_ID,
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  ENVIRONMENT,
  LIQUIDITY_BONUS_MULTIPLIER,
  NETWORK,
  ONE_YEAR_IN_MS,
  getMerkleRoot,
  getPowerBadgeFids,
  isProduction,
  neynarLimiter,
} from "@farther/common";
import { v4 as uuidv4 } from "uuid";
import { AllocationType, prisma } from "../prisma";
import { getLpAccounts } from "../utils/getLpAccounts";
import { writeFile } from "../utils/helpers";
import { airdropSanityCheck } from "./airdropSanityCheck";

// const startTime = NEXT_AIRDROP_START_TIME;
// const endTime = NEXT_AIRDROP_END_TIME;

const startTime = new Date(1715716589000);
const endTime = new Date(startTime.getTime() + ONE_YEAR_IN_MS);

async function prepareLpBonusDrop() {
  await airdropSanityCheck({
    date: startTime,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  const accounts = await getLpAccounts();
  const powerFids = await getPowerBadgeFids();

  // Get all past liquidity reward allocations
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.LIQUIDITY,
      userId: {
        in: powerFids,
      },
    },
    select: {
      address: true,
      userId: true,
      // This is the amount that was used as the basis for calculating the bonus
      referenceAmount: true,
    },
  });

  // Group by address and sum amounts for each address
  const pastTotals: Record<string, bigint> = allocations.reduce(
    (acc, a) => ({
      ...acc,
      [a.address]: (acc[a.address] || BigInt(0)) + BigInt(a.referenceAmount),
    }),
    {},
  );

  console.info("pastTotals:", pastTotals);
  console.info("accounts:", accounts);

  // Get FID associated with each address
  const addresses = accounts.map((a) => a.id);
  console.log("addresses:", addresses);
  const usersData = await getUserData(addresses);

  // Subtract past liquidity reward allocations from each account's claimed rewards
  const allocationData = accounts.map((a) => {
    const referenceAmount =
      BigInt(a.rewardsClaimed) - (pastTotals[a.id] || BigInt(0));

    // Multiply each by two to get the LP bonus drop amount
    const amount = referenceAmount * BigInt(LIQUIDITY_BONUS_MULTIPLIER);
    return {
      address: a.id,
      fid: usersData.find((u) => {
        const address = u.addresses.find(
          (addr) => addr.toLowerCase() === a.id.toLowerCase(),
        );
        if (!address) throw new Error(`No address found for ${a.id}`);
        return address;
      })?.fid,
      amount,
      referenceAmount,
    };
  });

  // Create merkle tree
  const allocationSum = allocationData.reduce(
    (acc, a) => acc + BigInt(a.amount),
    BigInt(0),
  );

  // Create a merkle tree with the above recipients
  const rawLeafData = allocationData.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: r.amount.toString(),
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
      startTime,
      endTime,
    },
  });

  // Save allocations
  await prisma.allocation.createMany({
    data: allocationData.map((r, i) => ({
      id: uuidv4(),
      userId: r.fid,
      index: i,
      airdropId: airdrop.id,
      type: AllocationType.LIQUIDITY,
      address: r.address.toLowerCase(),
      amount: r.amount.toString(),
      referenceAmount: r.referenceAmount.toString(),
    })),
  });

  await writeFile(
    `airdrops/${NETWORK}/${AllocationType.LIQUIDITY.toLowerCase()}-${startTime.toISOString()}.json`,
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

  console.info({
    root,
    amount: allocationSum,
  });
}

async function getUserData(addresses: string[]) {
  if (isProduction) {
    const userData = await neynarLimiter.getUsersByAddress(addresses);
    return userData.map((u) => {
      return {
        fid: u.fid,
        addresses: u.verified_addresses.eth_addresses,
      };
    });
  }

  return addresses.map((a) => {
    if (a === DEV_USER_ADDRESS) {
      return {
        fid: DEV_USER_FID,
        addresses: [DEV_USER_ADDRESS],
      };
    }
    throw new Error(`No address found for address: ${a}`);
  });
}

prepareLpBonusDrop().catch(console.error);
