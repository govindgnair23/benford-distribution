import {
  benfordProbability,
  decomposePositive,
  firstDigitFromLog10
} from "./benford";

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
