import gql from "graphql-tag";

export const FartherPositions = gql`
  query FartherPositions($account: String!, $poolId: String!) {
    positions(where: { account: $account, pool: $poolId }) {
      id
      tokenId
      isStaked
      account {
        id
        rewards {
          amount
          token {
            id
          }
        }
      }
      pool {
        id
      }
    }
  }
`;
