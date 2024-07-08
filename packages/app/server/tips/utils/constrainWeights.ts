export function constrainWeights({
  weights,
  breadth,
}: {
  weights: number[];
  breadth: number;
}): number[] {
  const sortedWeights = weights.slice().sort((a, b) => a - b);
  const smallToBigRatio =
    sortedWeights[0] / sortedWeights[sortedWeights.length - 1];

  if (weights.length === 0) return [];

  if (breadth === 1 || smallToBigRatio > 0.2) return weights;

  if (breadth <= 0) {
    throw new Error("Breadth must be greater than 0");
  }

  if (breadth > 1) {
    throw new Error("Breadth must be less than or equal to 1");
  }

  const medianWeight = sortedWeights[Math.floor(sortedWeights.length / 2)];

  return weights.map((weight) => {
    const deviation = weight - medianWeight;
    const constrainedDeviation = deviation * breadth;
    return medianWeight + constrainedDeviation;
  });
}
