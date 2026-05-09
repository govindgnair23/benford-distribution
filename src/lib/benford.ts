export interface DecomposedPositive {
  value: number;
  order: number;
  significand: number;
  log10: number;
  fractionalLog: number;
}

export function fractionalPart(value: number): number {
  return value - Math.floor(value);
}

export function decomposePositive(value: number): DecomposedPositive {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Expected a positive finite value");
  }

  const log10 = Math.log10(value);
  const order = Math.floor(log10);
  const significand = value / 10 ** order;

  return {
    value,
    order,
    significand,
    log10,
    fractionalLog: fractionalPart(log10)
  };
}

export function fractionalLog10(value: number): number {
  return decomposePositive(value).fractionalLog;
}

export function firstDigitFromLog10(log10Value: number): number {
  if (!Number.isFinite(log10Value)) {
    throw new Error("Expected a finite log10 value");
  }

  const significand = 10 ** fractionalPart(log10Value);
  return Math.min(9, Math.max(1, Math.floor(significand)));
}

export function benfordProbability(digit: number): number {
  if (!Number.isInteger(digit) || digit < 1 || digit > 9) {
    throw new Error("Benford digit must be an integer from 1 to 9");
  }

  return Math.log10(1 + 1 / digit);
}

export function benfordProbabilities(): number[] {
  return Array.from({ length: 9 }, (_, index) => benfordProbability(index + 1));
}
