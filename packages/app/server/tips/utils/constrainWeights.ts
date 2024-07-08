export function constrainWeights({
  weights,
  breadth,
}: {
  weights: number[];
  breadth: number;
}): number[] {
  if (weights.length === 0) return [];

  if (breadth <= 0) {
    throw new Error("Breadth must be greater than 0");
  }

  if (breadth > 1) {
    throw new Error("Breadth must be less than or equal to 1");
  }

  if (breadth === 1) return weights;

  const sortedWeights = weights.slice().sort((a, b) => a - b);
  const medianWeight = sortedWeights[Math.floor(sortedWeights.length / 2)];

  return weights.map((weight) => {
    const deviation = weight - medianWeight;
    const constrainedDeviation = deviation * breadth;
    return medianWeight + constrainedDeviation;
  });
}
