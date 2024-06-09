import { NFTPositionMngrAbi } from "../abis";
import { contractAddresses } from "../constants";
import { viemPublicClient } from "../viem";

type ResponseData = {
  data: {
    positionsConnection: {
      edges: { node: { id: string; owner: { id: string } } }[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  };
};

export async function getLpBalances() {
  const positionOwners: { id: string; owner: string }[] = [];

  let hasNextPage = true;
  let cursor: string | undefined = undefined;

  while (hasNextPage) {
    const queryString = fartherIndexerQuery(cursor);

    const response = await fetch(
      `https://farther.squids.live/farther-production/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: queryString,
      },
    );

    const data = (await response.json()) as ResponseData;

    hasNextPage = data.data.positionsConnection.pageInfo.hasNextPage;
    cursor = data.data.positionsConnection.pageInfo.endCursor;

    for (const edge of data.data.positionsConnection.edges) {
      positionOwners.push({
        id: edge.node.id,
        owner: edge.node.owner.id,
      });
    }
  }

  for (const position of positionOwners.slice(5)) {
    const info = await viemPublicClient.readContract({
      abi: NFTPositionMngrAbi,
      address: contractAddresses.NFT_POSITION_MANAGER,
      functionName: "positions",
      args: [BigInt(position.id)],
    });

    console.log(info);
  }
}

const fartherIndexerQuery = (cursor?: string) =>
  JSON.stringify({
    operationName: "liquidityPositions",
    variables: null,
    query: `
      query liquidityPositions {
        positionsConnection(
          where: { liquidity_gt: 0 }
          orderBy: liquidity_DESC
          after: ${cursor ? `"${cursor}"` : null}
        ) {
          edges {
            node {
              id
              owner {
                id
              }
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            endCursor
            startCursor
          }
        }
      }
    `,
  });

getLpBalances().catch(console.error);
