import { describe, expect, it } from "vitest";

import { describeNumber, digitLogIntervals } from "./numberMapping";

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
