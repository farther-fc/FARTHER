import {
  TipRelation,
  calculateInteractionDiversity,
  createGraph,
  getClusterCoefficient,
} from "./graphUtils";

export function detectNefariousClusters({
  tips,
  minTips,
  clusteringThreshold,
  diversityThreshold,
}: {
  tips: TipRelation[];
  minTips: number;
  clusteringThreshold: number;
  diversityThreshold: number;
}) {
  const graph = createGraph({ tips, minTips });

  // Detect dense subgraphs based on clustering coefficient
  const denseSubgraphs: { id: string; clusterCoef: number }[][] = [];
  graph.forEachNode((node) => {
    const clusterCoef = getClusterCoefficient(graph, node);
    if (clusterCoef >= clusteringThreshold) {
      const neighbors = graph.neighbors(node);
      const subgraph = [
        { id: node, clusterCoef },
        ...neighbors.map((id) => ({
          id,
          clusterCoef: getClusterCoefficient(graph, id),
        })), // Include all neighbors
      ];
      if (subgraph.length > 2) {
        denseSubgraphs.push(subgraph);
      }
    }
  });

  // Deduplicate and filter clusters
  const uniqueClusters: { id: string; clusterCoef: number }[][] = [];
  const seenNodes = new Set<string>();
  denseSubgraphs.forEach((subgraph) => {
    const newCluster = subgraph.filter((node) => !seenNodes.has(node.id));
    if (newCluster.length > 1) {
      // Calculate interaction diversity for the entire cluster
      const clusterNodes = new Set(newCluster.map((c) => c.id));
      let lowDiversity = true;

      for (const node of newCluster) {
        const diversity = calculateInteractionDiversity(
          graph,
          node.id,
          clusterNodes,
        );
        if (diversity > diversityThreshold) {
          lowDiversity = false;
          break;
        }
      }

      if (lowDiversity) {
        uniqueClusters.push(newCluster);
        newCluster.forEach((node) => seenNodes.add(node.id));
      }
    }
  });

  return uniqueClusters.map((c) =>
    c.map((node) => ({
      id: Number(node.id),
      clusterCoef: node.clusterCoef,
    })),
  );
}
