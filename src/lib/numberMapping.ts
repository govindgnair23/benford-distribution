import {
  benfordProbability,
  decomposePositive,
  firstDigitFromLog10
} from "./benford";
import { createSeededRandom, normalRandom } from "./random";

export interface NumberDescription {
  value: number;
  exponent: number;
  significand: number;
  logValue: number;
  fractionalLog: number;
  digit: number;
}

export interface DigitLogInterval {
  digit: number;
  start: number;
  end: number;
  probability: number;
}

export const digitLogIntervals: DigitLogInterval[] = Array.from(
  { length: 9 },
  (_, index) => {
    const digit = index + 1;
    const start = Math.log10(digit);
    const end = Math.log10(digit + 1);

    return {
      digit,
      start,
      end,
      probability: benfordProbability(digit)
    };
  }
);

export function describeNumber(value: number): NumberDescription {
  const decomposition = decomposePositive(value);

  return {
    value: decomposition.value,
    exponent: decomposition.order,
    significand: decomposition.significand,
    logValue: decomposition.log10,
    fractionalLog: decomposition.fractionalLog,
    digit: firstDigitFromLog10(decomposition.log10)
  };
}

export interface LogSpread {
  /** Center of log10(X); 2.5 puts the typical value near 300. */
  logCenter: number;
  /** Standard deviation of log10(X), in orders of magnitude. */
  logSpread: number;
}

export type SpreadPreset = "wide" | "narrow";

// Wide: values cover many orders of magnitude, so fractional logs are close
// to uniform. Narrow: values stay within one order of magnitude, so they bunch.
export const spreadPresets: Record<SpreadPreset, LogSpread> = {
  wide: { logCenter: 2.5, logSpread: 1.5 },
  narrow: { logCenter: 2.5, logSpread: 0.15 }
};

interface SampleOptions extends LogSpread {
  count: number;
  seed: number;
}

// Numbers whose log10 is Normal(logCenter, logSpread²).
export function sampleNumbers({ count, seed, logCenter, logSpread }: SampleOptions): NumberDescription[] {
  const random = createSeededRandom(seed);
  return Array.from({ length: count }, () => {
    const logValue = logCenter + logSpread * normalRandom(random);
    return describeNumber(10 ** logValue);
  });
}

export function tallyFractionalLogs(numbers: NumberDescription[], bins: number): number[] {
  const counts = Array.from({ length: bins }, () => 0);
  for (const number of numbers) {
    counts[Math.min(bins - 1, Math.floor(number.fractionalLog * bins))] += 1;
  }
  return counts;
}

export function tallyFirstDigits(numbers: NumberDescription[]): number[] {
  const counts = Array.from({ length: 9 }, () => 0);
  for (const number of numbers) counts[number.digit - 1] += 1;
  return counts;
}
