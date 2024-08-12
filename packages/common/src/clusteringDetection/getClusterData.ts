import { degreeCentrality } from "graphology-metrics/centrality/degree";
import { TipRelation, createGraph, getClusterCoefficient } from "./graphUtils";

export function getClusterData({
  tips,
  minTips,
}: {
  tips: TipRelation[];
  minTips: number;
}) {
  const graph = createGraph({ tips, minTips });

  // Calculate the clustering coefficient for each user
  const clusterCoefficients: { userId: number; clusterCoef: number }[] = [];
  graph.forEachNode((node) => {
    const clusterCoeff = getClusterCoefficient(graph, node);
    clusterCoefficients.push({
      userId: Number(node),
      clusterCoef: clusterCoeff,
    });
  });

  const centrality = degreeCentrality(graph);

  return clusterCoefficients.map((cluster) => ({
    ...cluster,
    degreeCentrality: centrality[cluster.userId],
  }));
}
