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
    )}. The sample is starting to spread across the log scale, but fractional logs may still show visible structure. Sampling noise can still move the digit bars.`;
  }

  return `SD(log10 X) is ${logWidth.toFixed(
    2
  )}, spanning multiple orders of magnitude. The wrapped fractional logs are close to uniform, so the first-digit distribution is closer to Benford. Current RMSE is ${benfordRmse.toFixed(
    3
  )}.`;
}
