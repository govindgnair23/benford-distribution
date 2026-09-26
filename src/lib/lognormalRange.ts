/** Approximate central 95% interval when log₁₀(X) is Normal. */
export function lognormalMiddle95(mean: number, standardDeviation: number) {
  const halfWidth = 1.96 * standardDeviation;
  return {
    lower: 10 ** (mean - halfWidth),
    upper: 10 ** (mean + halfWidth),
    ordersOfMagnitude: 2 * halfWidth
  };
}
