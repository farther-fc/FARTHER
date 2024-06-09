import gql from "graphql-tag";

export const FartherPositions = gql`
  query FartherPositions($ownerId: String!, $poolId: String!) {
    positions(where: { owner: { id_eq: $ownerId }, pool: { id_eq: $poolId } }) {
      id
      isStaked
      isHeldByStaker
      liquidity
    }
    accountById(id: $ownerId) {
      id
      rewardsClaimed
    }
  }
`;

export const LPRewardClaimers = gql`
  query LPRewardClaimers {
    accounts(where: { rewardsClaimed_gt: 0 }) {
      id
      rewardsClaimed
    }
  }
`;
