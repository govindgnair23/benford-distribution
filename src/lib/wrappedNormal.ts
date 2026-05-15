export interface ShiftedDensityContribution {
  shift: number;
  x: number;
  density: number;
}

export interface WrappedDensityPoint {
  residue: number;
  density: number;
}

interface WrappedDensityInput {
  mean: number;
  standardDeviation: number;
  residue: number;
  minShift: number;
  maxShift: number;
}

function assertFiniteNumber(value: number, name: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`Expected ${name} to be finite`);
  }
}

function assertValidStandardDeviation(standardDeviation: number) {
  assertFiniteNumber(standardDeviation, "standard deviation");
  if (standardDeviation <= 0) {
    throw new Error("Expected a positive standard deviation");
  }
}

export function normalDensity(
  x: number,
  mean: number,
  standardDeviation: number
): number {
  assertFiniteNumber(x, "x");
  assertFiniteNumber(mean, "mean");
  assertValidStandardDeviation(standardDeviation);

  const z = (x - mean) / standardDeviation;
  return (
    Math.exp(-0.5 * z * z) /
    (standardDeviation * Math.sqrt(2 * Math.PI))
  );
}

export function shiftedDensityContributions({
  mean,
  standardDeviation,
  residue,
  minShift,
  maxShift
}: WrappedDensityInput): ShiftedDensityContribution[] {
  assertFiniteNumber(residue, "residue");
  if (residue < 0 || residue >= 1) {
    throw new Error("Expected residue to be in [0, 1)");
  }
  if (!Number.isInteger(minShift) || !Number.isInteger(maxShift)) {
    throw new Error("Expected shifts to be integers");
  }
  if (minShift > maxShift) {
    throw new Error("Expected minShift to be less than or equal to maxShift");
  }

  return Array.from({ length: maxShift - minShift + 1 }, (_, index) => {
    const shift = minShift + index;
    const x = Number((shift + residue).toFixed(12));
    return {
      shift,
      x,
      density: normalDensity(x, mean, standardDeviation)
    };
  });
}

export function wrappedDensitySum(input: WrappedDensityInput): number {
  return shiftedDensityContributions(input).reduce(
    (sum, point) => sum + point.density,
    0
  );
}

interface WrappedDensityProfileInput
  extends Omit<WrappedDensityInput, "residue"> {
  step: number;
}

export function wrappedDensityProfile({
  step,
  ...input
}: WrappedDensityProfileInput): WrappedDensityPoint[] {
  assertFiniteNumber(step, "step");
  if (step <= 0 || step > 1) {
    throw new Error("Expected step to be in (0, 1]");
  }

  const pointCount = Math.round(1 / step);
  return Array.from({ length: pointCount + 1 }, (_, index) => {
    const residue = Number((index * step).toFixed(12));
    const wrappedResidue = residue === 1 ? 0 : residue;
    return {
      residue,
      density: wrappedDensitySum({
        ...input,
        residue: wrappedResidue
      })
    };
  });
}
