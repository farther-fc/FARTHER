export function constrainWeights({
  weights,
  factor,
}: {
  weights: number[];
  factor: number;
}): number[] {
  if (weights.length === 0) return [];

  if (factor < 0 || factor > 1) {
    throw new Error("Factor must be between 0 and 1");
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const averageWeight = totalWeight / weights.length;

  return weights.map(
    (weight) => weight * (1 - factor) + averageWeight * factor,
  );
}
