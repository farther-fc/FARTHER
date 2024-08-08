import {
  ANVIL_AIRDROP_ADDRESS,
  CHAIN_ID,
  DEV_USER_ADDRESS,
  DEV_USER_FID,
  ENVIRONMENT,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  getLpBonusRewards,
  getMerkleRoot,
  isProduction,
  neynar,
} from "@farther/common";
import { writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { getLpAccounts } from "../../../app/server/liquidity/getLpAccounts";
import { formatNum } from "../lib/utils/helpers";
import { AllocationType, prisma } from "../prisma";
import { airdropSanityCheck } from "./airdropSanityCheck";

async function prepareLpBonusDrop() {
  await airdropSanityCheck({
    date: NEXT_AIRDROP_START_TIME,
    network: NETWORK,
    environment: ENVIRONMENT,
  });

  try {
    const lps = await getLpAccounts();
    const lpsWithRewards = Array.from(lps.values()).filter(
      (lp) =>
        lp.rewardsClaimable > 0 ||
        lp.rewardsClaimed > 0 ||
        lp.rewardsUnclaimed > 0,
    );

    const addresses = Array.from(lpsWithRewards).map((d) => d.id);

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
        amount: true,
        referenceAmount: true,
      },
    });

    // Group by address and sum amounts for each address
    const previouslyAllocated: Record<
      string,
      {
        amount: bigint;
        referenceAmount: bigint;
      }
    > = allocations.reduce((acc, a) => {
      if (!a.address) {
        throw new Error(
          `No address found for allocation: ${JSON.stringify(a)}`,
        );
      }

      if (!acc[a.address]) {
        acc[a.address] = {
          amount: BigInt(a.amount),
          referenceAmount: BigInt(a.referenceAmount || 0),
        };
      } else {
        acc[a.address].amount += BigInt(a.amount);
        acc[a.address].referenceAmount += BigInt(a.referenceAmount || 0);
      }
      return acc;
    }, {});

    // Limit to users with power badges
    const usersData = await getUserData(addresses);
    const lpsWithPowerBadge = usersData.filter((u) => !!u.powerBadge);

    const allocationData = lpsWithPowerBadge
      .map((u) => {
        const account = lpsWithRewards.find(
          (lp) => lp.id.toLowerCase() === u.address.toLowerCase(),
        );

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

        const totalRewards = getLpBonusRewards({
          claimedWad: account.rewardsClaimed,
          claimableWad: account.rewardsClaimable,
          pendingWad: account.rewardsUnclaimed,
        });

        const prevAllocated =
          previouslyAllocated[account.id]?.amount || BigInt(0);
        const amount = totalRewards - prevAllocated;

        console.log({
          totalRewards,
          prevAllocated,
          amount,
        });

        return {
          address: account.id,
          fid: u.fid,
          // TODO: verify this is correct
          amount,
        };
      })
      .filter((a) => a.amount > BigInt(0));

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

    await prisma.$transaction(async (tx) => {
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

      // Save allocations
      await tx.allocation.createMany({
        data: allocationData.map((r, i) => ({
          id: uuidv4(),
          userId: r.fid,
          index: i,
          airdropId: airdrop.id,
          type: AllocationType.LIQUIDITY,
          address: r.address.toLowerCase(),
          amount: r.amount.toString(),
        })),
      });

      await writeFileSync(
        `airdrops/${ENVIRONMENT}/${AllocationType.LIQUIDITY.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
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
    });

    const sortedallocations = allocationData.sort((a, b) => {
      if (BigInt(a.amount) < BigInt(b.amount)) {
        return 1;
      } else if (BigInt(a.amount) > BigInt(b.amount)) {
        return -1;
      } else {
        return 0;
      }
    });

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
    const userData = await neynar.getUsersByAddress(addresses);

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
