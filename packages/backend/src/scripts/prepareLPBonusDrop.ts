import {
  // ANVIL_AIRDROP_ADDRESS,
  // CHAIN_ID,
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  ENVIRONMENT,
  LIQUIDITY_BONUS_MULTIPLIER,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  getMerkleRoot,
  isProduction,
  neynarLimiter,
} from "@farther/common";
// import { v4 as uuidv4 } from "uuid";
import { AllocationType, prisma } from "../prisma";
import { getLpAccounts } from "../utils/getLpAccounts";
import { formatNum } from "../utils/helpers";
import { airdropSanityCheck } from "./airdropSanityCheck";

const startTime = NEXT_AIRDROP_START_TIME;
const endTime = NEXT_AIRDROP_END_TIME;

async function prepareLpBonusDrop() {
  await airdropSanityCheck({
    date: startTime,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  try {
    const accounts = await getLpAccounts();
    const addresses = Array.from(accounts).map(([id]) => id);

    // Get all airdropped liquidity reward allocations
    const allocations = await prisma.allocation.findMany({
      where: {
        type: AllocationType.LIQUIDITY,
        address: {
          in: addresses,
        },
        airdropId: {
          not: null,
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

    // Limit to users with power badges
    const usersData = await getUserData(addresses);
    const lpsWithPowerBadge = usersData.filter((u) => !!u.powerBadge);

    const allocationData = lpsWithPowerBadge.map((u) => {
      const account = accounts.get(u.address);

      if (u.address !== account?.id) {
        throw new Error(
          `Account address mismatch: ${u.address}, ${account?.id}`,
        );
      }

      if (!account) {
        throw new Error(
          `No account found for address: ${u.address}, fid: ${u.fid}`,
        );
      }

      // Subtract past liquidity reward allocations from each account's claimed & unclaimed rewards
      const referenceAmount =
        BigInt(account.rewardsClaimed) +
        BigInt(account.rewardsUnclaimed) -
        (pastTotals[account.id] || BigInt(0));

      // Multiply that amount by the bonus multiplier
      const amount = referenceAmount * BigInt(LIQUIDITY_BONUS_MULTIPLIER);
      return {
        address: account.id,
        fid: u.fid,
        amount,
        referenceAmount,
      };
    });

    console.log(
      allocationData.map((r, i) => ({
        fid: r.fid,
        address: r.address.toLowerCase(),
      })),
    );

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

    if (root === "0x") {
      throw new Error("Merkle root is 0x");
    }

    // TODO: Prior to running this again, test it many times. Something still seems off.

    // await prisma.$transaction(async (tx) => {
    //   // Create Airdrop
    //   const airdrop = await tx.airdrop.create({
    //     data: {
    //       chainId: CHAIN_ID,
    //       amount: allocationSum.toString(),
    //       root,
    //       address:
    //         ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
    //       startTime,
    //       endTime,
    //     },
    //   });

    //   // Save allocations
    //   await tx.allocation.createMany({
    //     data: allocationData.map((r, i) => ({
    //       id: uuidv4(),
    //       userId: r.fid,
    //       index: i,
    //       airdropId: airdrop.id,
    //       type: AllocationType.LIQUIDITY,
    //       address: r.address.toLowerCase(),
    //       amount: r.amount.toString(),
    //       referenceAmount: r.referenceAmount.toString(),
    //     })),
    //   });

    //   await writeFile(
    //     `airdrops/${ENVIRONMENT}/${AllocationType.LIQUIDITY.toLowerCase()}-${startTime.toISOString()}.json`,
    //     JSON.stringify(
    //       {
    //         root,
    //         amount: allocationSum.toString(),
    //         rawLeafData,
    //       },
    //       null,
    //       2,
    //     ),
    //   );
    // });

    const sortedallocations = allocationData.sort((a, b) => {
      if (BigInt(a.amount) < BigInt(b.amount)) {
        return 1;
      } else if (BigInt(a.amount) > BigInt(b.amount)) {
        return -1;
      } else {
        return 0;
      }
    });

    console.log(allocationData);

    console.info({
      root,
      amount: allocationSum,
      recipients: sortedallocations.length,
      maxUserAllocation: formatNum(sortedallocations[0].amount),
      biggestEarner: sortedallocations[0].address,
      minUserAllocation: formatNum(
        sortedallocations[sortedallocations.length - 1].amount,
      ),
      startTime: Math.round(NEXT_AIRDROP_START_TIME.getTime() / 1000),
    });
  } catch (e) {
    console.error(e);
  }
}

async function getUserData(addresses: string[]) {
  if (isProduction) {
    const userData = await neynarLimiter.getUsersByAddress(addresses);

    return Object.entries(userData).map(([address, users]) => {
      // If multiple users, choose the first one with a power badge (same logic as in the frontend)
      const user = Array.isArray(users)
        ? users.sort(
            (a, b) => (b.power_badge ? 1 : 0) - (a.power_badge ? 1 : 0),
          )[0]
        : users;

      return {
        fid: user.fid,
        powerBadge: user.power_badge,
        address,
      };
    });
  }

  return addresses.map((a) => {
    if (a === DEV_USER_ADDRESS) {
      return {
        fid: DEV_USER_FID,
        address: DEV_USER_ADDRESS,
        powerBadge: true,
      };
    }
    throw new Error(`No address found for address: ${a}`);
  });
}

prepareLpBonusDrop().catch(console.error);
