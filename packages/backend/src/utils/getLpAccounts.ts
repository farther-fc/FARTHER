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
import { keccak256 } from "ethers";
import { formatNum } from "./helpers";

type Account = {
  id: string;
  rewardsClaimed: string;
};

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
    console.info(account.id, formatNum(account.rewardsClaimed));
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
    incentiveRewardsTotalAllocation: formatNum(incentiveRewardsTotalAllocation),
    currentIncentiveProgramTotal: formatNum(currentIncentiveProgramTotal),
    totalDrippedSoFar: formatNum(totalDrippedSoFar),
    totalRemaining: formatNum(totalRemaining),
    totalActuallyClaimed: formatNum(totalActuallyClaimed),
    difference: formatNum(difference),
  });

  return accounts;
}
