import {
  ENVIRONMENT,
  UniswapV3StakerAbi,
  contractAddresses,
  incentivePrograms,
  viemPublicClient,
} from "@farther/common";
import axios from "axios";
import { Promise as Bluebird } from "bluebird";
import { Address } from "viem";

type LiqProviderAccount = {
  id: string;
  rewardsClaimed: string;
  positions: {
    id: string;
    isStaked: boolean;
  }[];
};

export type FormattedLiqProviderAccount = {
  id: string;
  rewardsClaimed: bigint;
  rewardsUnclaimed: bigint;
  rewardsClaimable: bigint;
};

export async function getLpAccounts(
  addresses?: string[],
): Promise<Map<string, FormattedLiqProviderAccount>> {
  // Get all liquidity providers who have claimed rewards
  const query = await axios({
    url: `https://farther.squids.live/farther-${ENVIRONMENT}/graphql`,
    method: "post",
    data: {
      query: addresses ? LiqProvidersByAddress(addresses) : AllLiqProviders,
    },
  });

  const accounts: LiqProviderAccount[] = query.data.data.accounts;

  const formattedAccounts = new Map(
    accounts.map((account) => [
      account.id,
      {
        id: account.id,
        rewardsClaimed: BigInt(account.rewardsClaimed || 0),
        rewardsUnclaimed: BigInt(0),
        rewardsClaimable: BigInt(0),
      },
    ]),
  );

  for (const account of accounts) {
    const unclaimedRewards = await Bluebird.map(
      account.positions.filter((p) => p.isStaked),
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

    const claimableRewards = await viemPublicClient.readContract({
      abi: UniswapV3StakerAbi,
      address: contractAddresses.UNISWAP_V3_STAKER,
      functionName: "rewards",
      args: [contractAddresses.FARTHER, account.id as Address],
    });

    formattedAccounts.get(account.id).rewardsUnclaimed =
      unclaimedRewards.reduce((total, r) => total + BigInt(r), BigInt(0));
    formattedAccounts.get(account.id).rewardsClaimable = claimableRewards;
  }

  return formattedAccounts;
}

const LPRewardClaimers = `
  query LPRewardClaimers {
    accounts(where: { rewardsClaimed_gt: 0 }) {
      id
      rewardsClaimed
      positions {
        id
        isStaked
      }
    }
  }
`;

const AllLiqProviders = `
  query AllLiqProviders {
    accounts {
      id
      rewardsClaimed
      positions {
        id
        isStaked
      }
    }
  }
`;

const LiqProvidersByAddress = (addresses: string[]) => `
  query AllLiqProviders {
    accounts(where: { id_in: ${JSON.stringify(addresses)}}) {
      id
      rewardsClaimed
      positions {
        id
        isStaked
      }
    }
  }
`;
