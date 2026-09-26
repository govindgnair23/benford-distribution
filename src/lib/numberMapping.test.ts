import { describe, expect, it } from "vitest";

import { benfordProbability } from "./benford";
import {
  describeNumber,
  digitLogIntervals,
  sampleNumbers,
  spreadPresets,
  tallyFirstDigits,
  tallyFractionalLogs
} from "./numberMapping";

describe("describeNumber", () => {
  it.each([
    { value: 3140, exponent: 3, significand: 3.14, digit: 3 },
    { value: 3147, exponent: 3, significand: 3.147, digit: 3 },
    { value: 125, exponent: 2, significand: 1.25, digit: 1 },
    { value: 0.0314, exponent: -2, significand: 3.14, digit: 3 },
    { value: 90000, exponent: 4, significand: 9, digit: 9 }
  ])(
    "maps $value to first digit $digit across magnitudes",
    ({ value, exponent, significand, digit }) => {
      const result = describeNumber(value);

      expect(result.value).toBe(value);
      expect(result.exponent).toBe(exponent);
      expect(result.significand).toBeCloseTo(significand, 12);
      expect(result.logValue).toBeCloseTo(Math.log10(value), 12);
      expect(result.fractionalLog).toBeGreaterThanOrEqual(0);
      expect(result.fractionalLog).toBeLessThan(1);
      expect(result.digit).toBe(digit);
    }
  );

  it.each([1, 10, 1000, 0.1, 0.001])(
    "handles the power of ten %s without rounding into another interval",
    (value) => {
      expect(describeNumber(value)).toMatchObject({
        exponent: Math.log10(value),
        significand: 1,
        fractionalLog: 0,
        digit: 1
      });
    }
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid input %s",
    (value) => {
      expect(() => describeNumber(value)).toThrow(/positive finite/i);
    }
  );
});

describe("digitLogIntervals", () => {
  it("partitions the unit fractional-log interval for digits one through nine", () => {
    expect(digitLogIntervals).toHaveLength(9);
    expect(digitLogIntervals.map(({ digit }) => digit)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9
    ]);
    expect(digitLogIntervals[0]).toEqual({
      digit: 1,
      start: 0,
      end: Math.log10(2),
      probability: Math.log10(2)
    });
    expect(digitLogIntervals[8].end).toBe(1);

    for (let index = 0; index < digitLogIntervals.length; index += 1) {
      const interval = digitLogIntervals[index];
      expect(interval.probability).toBeCloseTo(interval.end - interval.start, 14);
      if (index > 0) {
        expect(interval.start).toBe(digitLogIntervals[index - 1].end);
      }
    }

    expect(
      digitLogIntervals.reduce((sum, interval) => sum + interval.probability, 0)
    ).toBeCloseTo(1, 14);
  });
});

describe("many numbers of varying magnitude", () => {
  const numbers = sampleNumbers({ count: 4000, seed: 11, ...spreadPresets.wide });

  it("is reproducible for the same seed", () => {
    expect(sampleNumbers({ count: 5, seed: 11, ...spreadPresets.wide }).map((n) => n.value)).toEqual(
      numbers.slice(0, 5).map((n) => n.value)
    );
  });

  it("spans many orders of magnitude", () => {
    const exponents = numbers.map((n) => n.exponent);
    expect(Math.max(...exponents) - Math.min(...exponents)).toBeGreaterThanOrEqual(6);
  });

  it("lands roughly uniformly on the fractional-log scale", () => {
    const bins = tallyFractionalLogs(numbers, 10);
    expect(bins).toHaveLength(10);
    expect(bins.reduce((sum, count) => sum + count, 0)).toBe(4000);
    for (const count of bins) expect(Math.abs(count - 400)).toBeLessThan(80);
  });

  it("gives Benford first digits on the original scale", () => {
    const counts = tallyFirstDigits(numbers);
    expect(counts).toHaveLength(9);
    counts.forEach((count, index) => {
      expect(count / 4000).toBeCloseTo(benfordProbability(index + 1), 1);
    });
    expect(counts[0]).toBeGreaterThan(5 * counts[8]);
  });

  it("counts a digit exactly when the fractional log falls in that digit's interval", () => {
    const counts = tallyFirstDigits(numbers);
    digitLogIntervals.forEach((interval, index) => {
      const inside = numbers.filter(
        (n) => n.fractionalLog >= interval.start && n.fractionalLog < interval.end
      ).length;
      expect(inside).toBe(counts[index]);
    });
  });
});

describe("numbers within one order of magnitude", () => {
  const numbers = sampleNumbers({ count: 4000, seed: 11, ...spreadPresets.narrow });

  it("stays within about one order of magnitude", () => {
    const logs = numbers.map((n) => n.logValue).sort((a, b) => a - b);
    expect(logs[Math.floor(0.975 * 4000)] - logs[Math.floor(0.025 * 4000)]).toBeLessThan(1);
  });

  it("bunches up on the fractional-log scale instead of spreading evenly", () => {
    const bins = tallyFractionalLogs(numbers, 10);
    expect(Math.max(...bins)).toBeGreaterThan(2 * 400);
    expect(Math.min(...bins)).toBeLessThan(400 / 4);
  });

  it("does not give Benford first digits", () => {
    const counts = tallyFirstDigits(numbers);
    expect(counts[0] / 4000).toBeLessThan(0.1);
  });
});
