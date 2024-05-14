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

type Account = {
  id: string;
  rewardsClaimed: string;
};

const format = (n: string | bigint) => Number(formatEther(n)).toLocaleString();

const incentiveRewardsTotalAllocation =
  BigInt(tokenAllocations.liquidityRewards) * WAD_SCALER;
const currentIncentiveProgramTotal =
  incentiveRewardsTotalAllocation / BigInt(3);

export async function getLpAccounts() {
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
    console.info(account.id, format(account.rewardsClaimed));
  }

  const totalActuallyClaimed = accounts.reduce(
    (acc, a) => acc + BigInt(a.rewardsClaimed),
    BigInt(0),
  );

  const [totalDrippedSoFar] = await viemPublicClient.readContract({
    abi: UniswapV3StakerAbi,
    address: contractAddresses.UNISWAP_V3_STAKER,
    functionName: "incentives",
    args: [
      keccak256(
        incentivePrograms[1].incentiveKey as `0x${string}`,
      ) as `0x${string}`,
    ],
  });

  const totalRemaining = currentIncentiveProgramTotal - totalDrippedSoFar;
  const difference = totalActuallyClaimed - totalRemaining;

  console.info({
    incentiveRewardsTotalAllocation: format(incentiveRewardsTotalAllocation),
    currentIncentiveProgramTotal: format(currentIncentiveProgramTotal),
    totalDrippedSoFar: format(totalDrippedSoFar),
    totalRemaining: format(totalRemaining),
    totalActuallyClaimed: format(totalActuallyClaimed),
    difference: format(difference),
  });

  return accounts;
}

// getLpAccounts();
