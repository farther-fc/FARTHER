import { UndirectedGraph } from "graphology";

export type TipRelation = {
  tipperId: number;
  tippeeId: number;
};

export function createGraph({
  tips,
  minTips,
}: {
  tips: TipRelation[];
  minTips: number;
}) {
  const graph = new UndirectedGraph();

  // Add edges to the graph
  tips.forEach((tip) => {
    if (!graph.hasNode(tip.tipperId)) graph.addNode(tip.tipperId);
    if (!graph.hasNode(tip.tippeeId)) graph.addNode(tip.tippeeId);
    if (!graph.hasEdge(tip.tipperId, tip.tippeeId)) {
      graph.addEdge(tip.tipperId, tip.tippeeId, { tipCount: 0 });
    }
    graph.setEdgeAttribute(
      tip.tipperId,
      tip.tippeeId,
      "tipCount",
      graph.getEdgeAttribute(tip.tipperId, tip.tippeeId, "tipCount") + 1,
    );
  });

  // Filter out edges with weights below the threshold
  graph.forEachEdge((edge, attributes) => {
    if (attributes.tipCount < minTips) {
      graph.dropEdge(edge);
    }
  });

  return graph;
}

// Function to calculate the local clustering coefficient for a node
export function getClusterCoefficient(
  graph: UndirectedGraph,
  node: string,
): number {
  const neighbors = graph.neighbors(node);
  const numNeighbors = neighbors.length;

  if (numNeighbors < 2) return 0;

  let actualEdges = 0;

  // Count the number of edges between neighbors
  for (let i = 0; i < numNeighbors; i++) {
    for (let j = i + 1; j < numNeighbors; j++) {
      if (graph.hasEdge(neighbors[i], neighbors[j])) {
        actualEdges++;
      }
    }
  }

  // Calculate the clustering coefficient
  const possibleEdges = (numNeighbors * (numNeighbors - 1)) / 2;

  return actualEdges / possibleEdges;
}

export function calculateInteractionDiversity(
  graph: UndirectedGraph,
  node: string,
  clusterNodes: Set<string>,
): number {
  let internalInteractions = 0;
  let externalInteractions = 0;

  graph.forEachNeighbor(node, (neighbor) => {
    if (clusterNodes.has(neighbor)) {
      internalInteractions++;
    } else {
      externalInteractions++;
    }
  });

  return externalInteractions / (internalInteractions + externalInteractions);
}
