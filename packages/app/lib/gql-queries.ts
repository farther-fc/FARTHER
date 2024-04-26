import gql from "graphql-tag";

export const FartherPositions = gql`
  query FartherPositions($ownerId: String!, $poolId: String!) {
    positions(where: { owner: { id_eq: $ownerId }, pool: { id_eq: $poolId } }) {
      id
      isStaked
      isHeldByStaker
      owner {
        id
      }
      pool {
        id
      }
    }
  }
`;
