import {
  ENVIRONMENT,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
  viemPublicClient,
} from "@farther/common";
import axios from "axios";
import { Promise as Bluebird } from "bluebird";
import { formatNum } from "./helpers";

type Account = {
  id: string;
  rewardsClaimed: string;
  positions: {
    id: string;
  }[];
};

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
          positions {
            id
          }
        }
      }
    `,
    },
  });

  const accounts: Account[] = query.data.data.accounts;

  const formattedAccounts = new Map(
    accounts.map((account) => [
      account.id,
      {
        id: account.id,
        rewardsClaimed: BigInt(account.rewardsClaimed),
        rewardsUnclaimed: BigInt(0),
      },
    ]),
  );

  for (const account of accounts) {
    console.log(account);
    const unclaimedRewards = await Bluebird.map(
      account.positions,
      async (position) => {
        const [unclaimedPositionReward] = await viemPublicClient.readContract({
          abi: UniswapV3StakerAbi,
          address: contractAddresses.UNISWAP_V3_STAKER,
          functionName: "getRewardInfo",
          args: [
            {
              rewardToken: contractAddresses.FARTHER,
              pool: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
              startTime: BigInt(incentivePrograms[1].startTime),
              endTime: BigInt(incentivePrograms[1].endTime),
              refundee: incentivePrograms[1].refundee,
            },
            // tokenId
            BigInt(position.id),
          ],
        });

        return unclaimedPositionReward;
      },
      { concurrency: 3 },
    );

    formattedAccounts.get(account.id).rewardsUnclaimed =
      unclaimedRewards.reduce((total, r) => total + BigInt(r), BigInt(0));
  }

  formattedAccounts.forEach((account) => {
    console.info({
      account: account.id,
      rewardsClaimed: formatNum(account.rewardsClaimed),
      rewardsUnclaimed: formatNum(account.rewardsUnclaimed),
    });
  });

  return formattedAccounts;
}

// getLpAccounts().then(console.info).catch(console.error);
