import { getLiqTokenAmounts } from "@farther/common";
import { NFTPositionMngrAbi, UniswapV3PoolAbi } from "@farther/common/src/abis";
import { contractAddresses } from "@farther/common/src/constants";
import { viemPublicClient } from "@farther/common/src/viem";

type ResponseData = {
  data: {
    positionsConnection: {
      edges: {
        node: { id: string; liquidity: string; owner: { id: string } };
      }[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  };
};

export async function getAllLiqProviderBalances() {
  const positionOwners: Map<string, { id: string; liquidity: number }[]> =
    new Map();

  const fartherBalances: { address: string; balance: number }[] = [];

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
      const owner = edge.node.owner.id;
      const liquidity = Number(edge.node.liquidity);
      const positionOwner = positionOwners.get(owner);

      // Only return positive liquidity
      if (!liquidity) continue;

      if (positionOwner) {
        positionOwner.push({ id: edge.node.id, liquidity });
      } else {
        positionOwners.set(owner, [{ id: edge.node.id, liquidity }]);
      }
    }
  }

  const [sqrtPriceX96]: [bigint] = (await viemPublicClient.readContract({
    abi: UniswapV3PoolAbi,
    address: contractAddresses.UNIV3_FARTHER_ETH_30BPS_POOL,
    functionName: "slot0",
  })) as any;

  for (const [owner, positions] of positionOwners) {
    let totalFartherBalance = BigInt(0);
    for (const { id, liquidity } of positions) {
      const [, , , , , tickLower, tickUpper] =
        await viemPublicClient.readContract({
          abi: NFTPositionMngrAbi,
          address: contractAddresses.NFT_POSITION_MANAGER,
          functionName: "positions",
          args: [BigInt(id)],
        });

      const [, fartherBalance] = getLiqTokenAmounts({
        tickLow: Number(tickLower),
        tickHigh: Number(tickUpper),
        liquidity: Number(liquidity),
        sqrtPriceX96: Number(sqrtPriceX96),
      });

      totalFartherBalance += BigInt(fartherBalance);
    }

    if (totalFartherBalance > BigInt(0)) {
      fartherBalances.push({
        address: owner,
        balance: Number(totalFartherBalance),
      });
    }
  }

  return fartherBalances;
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
              liquidity
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
