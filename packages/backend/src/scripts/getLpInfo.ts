import {
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
  incentivePrograms,
  tokenAllocations,
  viemPublicClient,
} from "@farther/common";
import { keccak256 } from "ethers";
import { getLpAccounts } from "../utils/getLpAccounts";
import { formatNum } from "../utils/helpers";

const incentiveRewardsTotalAllocation =
  BigInt(tokenAllocations.liquidityRewards) * WAD_SCALER;
const currentIncentiveProgramTotal =
  incentiveRewardsTotalAllocation / BigInt(3);

async function getLpInfo() {
  const accounts = await getLpAccounts();
  const totalActuallyClaimed = Array.from(accounts).reduce(
    (acc, [, a]) => acc + BigInt(a.rewardsClaimed),
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

  return {
    incentiveRewardsTotalAllocation: formatNum(incentiveRewardsTotalAllocation),
    currentIncentiveProgramTotal: formatNum(currentIncentiveProgramTotal),
    totalDrippedSoFar: formatNum(totalDrippedSoFar),
    totalRemaining: formatNum(totalRemaining),
    totalActuallyClaimed: formatNum(totalActuallyClaimed),
    difference: formatNum(difference),
  };
}

getLpInfo().then(console.log).catch(console.error);
