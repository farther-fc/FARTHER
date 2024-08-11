import { UndirectedGraph } from "graphology";

export type Tip = {
  tipperId: number;
  tippeeId: number;
};

// Function to calculate the local clustering coefficient for a node
function calculateClusteringCoefficient(
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

export function detectNefariousClusters({
  tips,
  minTips,
  clusteringThreshold,
}: {
  tips: Tip[];
  minTips: number;
  clusteringThreshold: number;
}): number[][] {
  const graph = new UndirectedGraph();

  // Add edges to the graph
  tips.forEach((tip) => {
    if (!graph.hasNode(tip.tipperId)) graph.addNode(tip.tipperId);
    if (!graph.hasNode(tip.tippeeId)) graph.addNode(tip.tippeeId);
    if (!graph.hasEdge(tip.tipperId, tip.tippeeId)) {
      graph.addEdge(tip.tipperId, tip.tippeeId, { weight: 0 });
    }
    graph.setEdgeAttribute(
      tip.tipperId,
      tip.tippeeId,
      "weight",
      graph.getEdgeAttribute(tip.tipperId, tip.tippeeId, "weight") + 1,
    );
  });

  // Filter out edges with weights below the threshold
  graph.forEachEdge((edge, attributes, source, target) => {
    if (attributes.weight < minTips) {
      graph.dropEdge(edge);
    }
  });

  // Detect dense subgraphs based on clustering coefficient
  const denseSubgraphs: string[][] = [];
  graph.forEachNode((node) => {
    const clusteringCoeff = calculateClusteringCoefficient(graph, node);
    if (clusteringCoeff >= clusteringThreshold) {
      const neighbors = graph.neighbors(node);
      const subgraph = [
        node,
        ...neighbors, // Include all neighbors
      ];
      if (subgraph.length > 2) {
        denseSubgraphs.push(subgraph);
      }
    }
  });

  // Deduplicate and filter clusters
  const uniqueClusters: string[][] = [];
  const seenNodes = new Set<string>();
  denseSubgraphs.forEach((subgraph) => {
    const newCluster = subgraph.filter((node) => !seenNodes.has(node));
    if (newCluster.length > 1) {
      uniqueClusters.push(newCluster);
      newCluster.forEach((node) => seenNodes.add(node));
    }
  });

  return uniqueClusters.map((cluster) => cluster.map((n) => Number(n)));
}
