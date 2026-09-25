import { benfordProbabilities, firstDigitFromLog10, fractionalPart } from "./benford";
import { expectedBenfordSamplingRmse, rmse } from "./diagnostics";
import { createSeededRandom } from "./random";

export interface AddVsMultiplyConfig {
  sampleSize: number;
  steps: number;
  startValue: number;
  /** Average amount added per step; each step adds between 0 and twice this. */
  addAmount: number;
  /** Largest relative change per step; each step multiplies by 1 ± up to this. */
  multiplyRange: number;
  seed: number;
}

export interface ProcessStep {
  firstDigitShares: number[];
  benfordRmse: number;
  /** Fractional-log histogram as a density over [0, 1), one value per bin. */
  fractionalDensity: number[];
  /** 2.5th and 97.5th percentiles of log10(X). */
  lowerLog: number;
  upperLog: number;
}

export interface ProcessRun {
  steps: ProcessStep[];
  /** log10(X) over time for a few example values. */
  paths: number[][];
  /** Smallest and largest log10(X) across the band and the example paths. */
  logRange: { min: number; max: number };
}

export interface AddVsMultiplyRun {
  add: ProcessRun;
  multiply: ProcessRun;
}

export type BenfordVerdict = "close" | "closer" | "far";

export const defaultAddVsMultiplyConfig: AddVsMultiplyConfig = {
  sampleSize: 4000,
  steps: 200,
  startValue: 100,
  addAmount: 10,
  multiplyRange: 0.3,
  seed: 7
};

const FRACTIONAL_BINS = 20;
const EXAMPLE_PATHS = 6;

// Both processes consume the same uniform draw u in [-1, 1) at each step, so
// the only difference between them is adding versus multiplying.
export function simulateAddVsMultiply(config: AddVsMultiplyConfig): AddVsMultiplyRun {
  const { sampleSize, steps, startValue, addAmount, multiplyRange } = config;
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    throw new Error("sampleSize must be a positive integer");
  }
  if (!Number.isInteger(steps) || steps < 0) {
    throw new Error("steps must be a non-negative integer");
  }
  if (!(startValue > 0) || !(addAmount >= 0)) {
    throw new Error("startValue must be positive and addAmount non-negative");
  }
  if (!(multiplyRange >= 0 && multiplyRange < 1)) {
    throw new Error("multiplyRange must be in [0, 1)");
  }

  const random = createSeededRandom(config.seed);
  const addLogs = new Float64Array((steps + 1) * sampleSize);
  const multiplyLogs = new Float64Array((steps + 1) * sampleSize);
  const startLog = Math.log10(startValue);

  for (let index = 0; index < sampleSize; index += 1) {
    let added = startValue;
    let multipliedLog = startLog;
    addLogs[index] = startLog;
    multiplyLogs[index] = startLog;
    for (let step = 1; step <= steps; step += 1) {
      const u = 2 * random() - 1;
      added += addAmount * (1 + u);
      multipliedLog += Math.log10(1 + multiplyRange * u);
      addLogs[step * sampleSize + index] = Math.log10(added);
      multiplyLogs[step * sampleSize + index] = multipliedLog;
    }
  }

  return {
    add: summarizeRun(addLogs, steps, sampleSize),
    multiply: summarizeRun(multiplyLogs, steps, sampleSize)
  };
}

function summarizeRun(logs: Float64Array, steps: number, sampleSize: number): ProcessRun {
  const benford = benfordProbabilities();
  const summaries: ProcessStep[] = [];
  let min = Infinity;
  let max = -Infinity;

  for (let step = 0; step <= steps; step += 1) {
    const slice = logs.slice(step * sampleSize, (step + 1) * sampleSize);
    const digitCounts = Array.from({ length: 9 }, () => 0);
    const binCounts = Array.from({ length: FRACTIONAL_BINS }, () => 0);
    for (const logValue of slice) {
      digitCounts[firstDigitFromLog10(logValue) - 1] += 1;
      const bin = Math.min(FRACTIONAL_BINS - 1, Math.floor(fractionalPart(logValue) * FRACTIONAL_BINS));
      binCounts[bin] += 1;
    }
    slice.sort();
    const lowerLog = slice[Math.floor(0.025 * sampleSize)];
    const upperLog = slice[Math.min(sampleSize - 1, Math.floor(0.975 * sampleSize))];
    min = Math.min(min, lowerLog);
    max = Math.max(max, upperLog);

    const firstDigitShares = digitCounts.map((count) => count / sampleSize);
    summaries.push({
      firstDigitShares,
      benfordRmse: rmse(firstDigitShares, benford),
      fractionalDensity: binCounts.map((count) => (count / sampleSize) * FRACTIONAL_BINS),
      lowerLog,
      upperLog
    });
  }

  const paths = Array.from({ length: Math.min(EXAMPLE_PATHS, sampleSize) }, (_, index) =>
    Array.from({ length: steps + 1 }, (_, step) => {
      const value = logs[step * sampleSize + index];
      min = Math.min(min, value);
      max = Math.max(max, value);
      return value;
    })
  );

  return { steps: summaries, paths, logRange: { min, max } };
}

export function benfordVerdict(benfordRmse: number, sampleSize: number): BenfordVerdict {
  const noise = expectedBenfordSamplingRmse(sampleSize);
  if (benfordRmse < 2 * noise) return "close";
  if (benfordRmse < 6 * noise) return "closer";
  return "far";
}
