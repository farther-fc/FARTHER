import {
  ENVIRONMENT,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
  incentivePrograms,
  tokenAllocations,
  viemPublicClient,
} from "@farther/common";
import axios from "axios";
import { formatEther, keccak256 } from "ethers";
import { AllocationType, prisma } from "../prisma";

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
      amount: true,
    },
  });

  // Group by address and sum amounts for each address
  const pastAllocationTotals = allocations.reduce(
    (acc, a) => ({
      ...acc,
      [a.address]: (acc[a.address] || BigInt(0)) + BigInt(a.amount),
    }),
    {},
  );

  // Subtract past liquidity reward allocations from each account's claimed rewards

  // Multiply each by two to get the LP bonus drop amount

  // Create airdrop

  // Save allocations
}

prepareLpBonusDrop().catch(console.error);
