import { describe, expect, it } from "vitest";

import {
  benfordProbability,
  decomposePositive,
  firstDigitFromLog10,
  fractionalPart,
  fractionalLog10
} from "./benford";

describe("benford math helpers", () => {
  it("decomposes 3140 into order and significand", () => {
    const result = decomposePositive(3140);

    expect(result.order).toBe(3);
    expect(result.significand).toBeCloseTo(3.14, 12);
    expect(result.log10).toBeCloseTo(3.497, 3);
    expect(result.fractionalLog).toBeCloseTo(0.497, 3);
  });

  it("computes fractional parts for positive and negative logs", () => {
    expect(fractionalPart(3.497)).toBeCloseTo(0.497, 12);
    expect(fractionalPart(-0.25)).toBeCloseTo(0.75, 12);
  });

  it("maps logs to leading digits across magnitudes", () => {
    expect(firstDigitFromLog10(Math.log10(3140))).toBe(3);
    expect(firstDigitFromLog10(Math.log10(0.078))).toBe(7);
    expect(firstDigitFromLog10(0)).toBe(1);
  });

  it("computes Benford probabilities for digits one through nine", () => {
    const probabilities = Array.from({ length: 9 }, (_, index) =>
      benfordProbability(index + 1)
    );

    expect(probabilities[0]).toBeCloseTo(0.30103, 5);
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(
      1,
      12
    );
  });

  it("rejects invalid positive decomposition inputs", () => {
    expect(() => decomposePositive(0)).toThrow(/positive finite/i);
    expect(() => decomposePositive(-1)).toThrow(/positive finite/i);
    expect(() => decomposePositive(Number.POSITIVE_INFINITY)).toThrow(
      /positive finite/i
    );
  });

  it("computes fractional log10 directly", () => {
    expect(fractionalLog10(3140)).toBeCloseTo(0.497, 3);
    expect(fractionalLog10(0.078)).toBeCloseTo(Math.log10(7.8), 12);
  });
});
