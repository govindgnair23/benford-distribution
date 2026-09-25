import { normalDensity } from "./wrappedNormal";

interface NormalParams {
  mean: number;
  standardDeviation: number;
}

export interface ShiftRange {
  /** First whole number of the visible log range (inclusive). */
  minShift: number;
  /** Last whole number of the visible log range (exclusive for strip starts). */
  maxShift: number;
}

export interface StackContribution {
  x: number;
  density: number;
  /** Stack height below this contribution: the sum of earlier densities. */
  base: number;
}

export interface FractionalStack {
  fractionalValue: number;
  contributions: StackContribution[];
  total: number;
}

interface StackInput extends NormalParams, ShiftRange {
  fractionalValues: number[];
}

// Abramowitz & Stegun 7.1.26, absolute error below 1.5e-7.
function erf(value: number): number {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * x);
  const poly =
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
    t;
  return sign * (1 - poly * Math.exp(-x * x));
}

export function normalCdf(x: number, mean: number, standardDeviation: number): number {
  return 0.5 * (1 + erf((x - mean) / (standardDeviation * Math.SQRT2)));
}

export function visibleShiftRange({ mean, standardDeviation }: NormalParams): ShiftRange {
  let minShift = Math.floor(mean - 4.5 * standardDeviation);
  let maxShift = Math.ceil(mean + 4.5 * standardDeviation);
  let widenHigh = true;
  while (maxShift - minShift < 3) {
    if (widenHigh) maxShift += 1;
    else minShift -= 1;
    widenHigh = !widenHigh;
  }
  return { minShift, maxShift };
}

export function stackFractionalDensities({
  mean,
  standardDeviation,
  fractionalValues,
  minShift,
  maxShift
}: StackInput): FractionalStack[] {
  return fractionalValues.map((fractionalValue) => {
    const contributions: StackContribution[] = [];
    let base = 0;
    for (let shift = minShift; shift < maxShift; shift += 1) {
      const x = Number((shift + fractionalValue).toFixed(10));
      const density = normalDensity(x, mean, standardDeviation);
      contributions.push({ x, density, base });
      base += density;
    }
    return { fractionalValue, contributions, total: base };
  });
}

function wideShiftRange({ mean, standardDeviation }: NormalParams) {
  return {
    first: Math.floor(mean - 9 * standardDeviation) - 1,
    last: Math.ceil(mean + 9 * standardDeviation) + 1
  };
}

export function wrappedDensityAt(fractionalValue: number, params: NormalParams): number {
  const { first, last } = wideShiftRange(params);
  let sum = 0;
  for (let shift = first; shift <= last; shift += 1) {
    sum += normalDensity(shift + fractionalValue, params.mean, params.standardDeviation);
  }
  return sum;
}

export function maxDeviationFromUniform(params: NormalParams, samples = 200): number {
  let worst = 0;
  for (let index = 0; index < samples; index += 1) {
    worst = Math.max(worst, Math.abs(wrappedDensityAt(index / samples, params) - 1));
  }
  return worst;
}

export function firstDigitShares(params: NormalParams): number[] {
  const { first, last } = wideShiftRange(params);
  const { mean, standardDeviation } = params;
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
    const low = Math.log10(digit);
    const high = Math.log10(digit + 1);
    let share = 0;
    for (let shift = first; shift <= last; shift += 1) {
      share +=
        normalCdf(shift + high, mean, standardDeviation) -
        normalCdf(shift + low, mean, standardDeviation);
    }
    return share;
  });
}
