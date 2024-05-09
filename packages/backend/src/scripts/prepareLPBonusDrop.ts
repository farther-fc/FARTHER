import {
  ANVIL_AIRDROP_ADDRESS,
  CHAIN_ID,
  ENVIRONMENT,
  LIQUIDITY_BONUS_MULTIPLIER,
  NETWORK,
  NEXT_AIRDROP_END_TIME,
  NEXT_AIRDROP_START_TIME,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
  getMerkleRoot,
  incentivePrograms,
  tokenAllocations,
  viemPublicClient,
} from "@farther/common";
import axios from "axios";
import { formatEther, keccak256 } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { AllocationType, prisma } from "../prisma";
import { writeFile } from "../utils/helpers";

type Account = {
  id: string;
  rewardsClaimed: string;
};

const format = (n: string | bigint) => Number(formatEther(n)).toLocaleString();

const totalIncentiveAllocation =
  BigInt(tokenAllocations.liquidityRewards / 3) * WAD_SCALER;

async function prepareLpBonusDrop() {
  // await airdropSanityCheck();

  // Get all liquidity providers who have claimed rewards
  const query = await axios({
    url: `https://farther.squids.live/farther-${ENVIRONMENT}/graphql`,
    method: "post",
    data: {
      query: `
      query LPRewardClaimers {
        accounts(where: { rewardsClaimed_gt: 0 }) {
          id
          rewardsClaimed
        }
      }
    `,
    },
  });

  const accounts: Account[] = query.data.data.accounts;

  for (const account of accounts) {
    console.log(account.id, format(account.rewardsClaimed));
  }

  const totalRewards = accounts.reduce(
    (acc, a) => acc + BigInt(a.rewardsClaimed),
    BigInt(0),
  );

  const [totalRewardsUnclaimed] = await viemPublicClient.readContract({
    abi: UniswapV3StakerAbi,
    address: contractAddresses.UNISWAP_V3_STAKER,
    functionName: "incentives",
    args: [
      keccak256(
        incentivePrograms[1].incentiveKey as `0x${string}`,
      ) as `0x${string}`,
    ],
  });

  const totalClaimed = totalIncentiveAllocation - totalRewardsUnclaimed;
  const diff = totalRewards - totalClaimed;

  console.log({
    totalIncentiveAllocation: format(totalIncentiveAllocation),
    totalRewardsUnclaimed: format(totalRewardsUnclaimed),
    totalClaimed: format(totalClaimed),
    totalRewards: format(totalRewards),
    diff: format(diff),
  });

  // Get all past liquidity reward allocations
  const allocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.LIQUIDITY,
    },
    select: {
      address: true,
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

  // Subtract past liquidity reward allocations from each account's claimed rewards
  const allocationData = accounts.map((a) => {
    const referenceAmount =
      BigInt(a.rewardsClaimed) - (pastTotals[a.id] || BigInt(0));
    // Multiply each by two to get the LP bonus drop amount
    const amount = referenceAmount * BigInt(LIQUIDITY_BONUS_MULTIPLIER);
    return {
      address: a.id,
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
      startTime: NEXT_AIRDROP_START_TIME,
      endTime: NEXT_AIRDROP_END_TIME,
    },
  });

  // Save allocations
  await prisma.allocation.createMany({
    data: allocationData.map((r, i) => ({
      id: uuidv4(),
      index: i,
      airdropId: airdrop.id,
      type: AllocationType.LIQUIDITY,
      address: r.address.toLowerCase(),
      amount: r.amount.toString(),
      referenceAmount: r.referenceAmount.toString(),
    })),
  });

  await writeFile(
    `airdrops/${NETWORK}/${AllocationType.LIQUIDITY.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
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
}

prepareLpBonusDrop().catch(console.error);
