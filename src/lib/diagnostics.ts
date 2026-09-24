import { benfordProbabilities } from "./benford";
import type { SimulatedSample } from "./simulation";

export type WidthLabel = "narrow" | "transitional" | "wide";

export interface SampleDiagnostics {
  logWidth: number;
  widthLabel: WidthLabel;
  benfordRmse: number;
  digitFrequencies: number[];
  explanation: string;
}

export function evaluateSample(sample: SimulatedSample): SampleDiagnostics {
  const digitFrequencies = firstDigitFrequencies(sample.firstDigits);
  const benfordRmse = rmse(digitFrequencies, benfordProbabilities());
  const widthLabel = classifyLogWidth(sample.logWidth);

  return {
    logWidth: sample.logWidth,
    widthLabel,
    benfordRmse,
    digitFrequencies,
    explanation: buildExplanation(widthLabel, benfordRmse, sample.logWidth)
  };
}

// SD(log10 X) cutoffs used to classify a sample's log width. Surfaced in the
// UI (SimulationControls guidance) so learners can predict classification.
export const LOG_WIDTH_THRESHOLDS = {
  narrowMax: 0.25,
  wideMin: 0.6
} as const;

export function classifyLogWidth(logWidth: number): WidthLabel {
  if (logWidth < LOG_WIDTH_THRESHOLDS.narrowMax) {
    return "narrow";
  }
  if (logWidth < LOG_WIDTH_THRESHOLDS.wideMin) {
    return "transitional";
  }
  return "wide";
}

export function firstDigitFrequencies(firstDigits: number[]): number[] {
  const counts = Array.from({ length: 9 }, () => 0);

  for (const digit of firstDigits) {
    if (digit >= 1 && digit <= 9) {
      counts[digit - 1] += 1;
    }
  }

  const total = firstDigits.length || 1;
  return counts.map((count) => count / total);
}

export function rmse(observed: number[], expected: number[]): number {
  if (observed.length !== expected.length) {
    throw new Error("Observed and expected arrays must have the same length");
  }

  const meanSquaredError =
    observed.reduce((sum, value, index) => {
      return sum + (value - expected[index]) ** 2;
    }, 0) / observed.length;

  return Math.sqrt(meanSquaredError);
}

// For N independent draws from exact Benford probabilities, this is the
// root-mean-square first-digit sampling error in probability units. It is a
// reference scale, not a goodness-of-fit cutoff.
export function expectedBenfordSamplingRmse(sampleSize: number): number {
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    throw new Error("sampleSize must be a positive integer");
  }

  const probabilities = benfordProbabilities();
  const sumOfVariances = probabilities.reduce(
    (sum, probability) => sum + probability * (1 - probability),
    0
  );
  return Math.sqrt(sumOfVariances / (probabilities.length * sampleSize));
}

function buildExplanation(
  widthLabel: WidthLabel,
  benfordRmse: number,
  logWidth: number
): string {
  if (widthLabel === "narrow") {
    return `SD(log10 X) is ${logWidth.toFixed(
      2
    )}, so the log values are concentrated within much less than one order of magnitude. Fractional logs stay concentrated, and the first digits are not close to Benford.`;
  }

  if (widthLabel === "transitional") {
    return `SD(log10 X) is ${logWidth.toFixed(
      2
    )}. Fractional logs may still show structure, while first digits can already look close to Benford. Current digit RMSE is ${benfordRmse.toFixed(
      3
    )}; compare it with the sampling-only reference below.`;
  }

  return `SD(log10 X) is ${logWidth.toFixed(
    2
  )}, spanning multiple orders of magnitude. That width does not guarantee Benford. Inspect the fractional-log histogram and compare the current digit RMSE of ${benfordRmse.toFixed(
    3
  )} with the sampling-only reference below.`;
}
