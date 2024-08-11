import { TipRelation, createGraph, getClusterCoefficient } from "./graphUtils";

export function getAllClusterCoefficients({
  tips,
  minTips,
}: {
  tips: TipRelation[];
  minTips: number;
}): { userId: number; clusterCoef: number }[] {
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

  return clusterCoefficients;
}
