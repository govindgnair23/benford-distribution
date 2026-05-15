import { describe, expect, it } from "vitest";

import {
  simulateOriginalNormal,
  simulateMultiplicativeGrowth
} from "./simulation";

describe("simulation", () => {
  it("returns positive original Normal samples and matching log samples", () => {
    const result = simulateOriginalNormal({
      mean: 1000,
      standardDeviation: 100,
      sampleSize: 3,
      seed: 12
    });

    expect(result.values).toHaveLength(3);
    expect(result.values.every((value) => value > 0)).toBe(true);
    expect(result.logSamples).toEqual(
      result.values.map((value) => expect.closeTo(Math.log10(value), 12))
    );
    expect(result.fractionalLogs).toHaveLength(3);
    expect(result.firstDigits).toHaveLength(3);
  });

  it("rejects nonpositive Normal samples until the requested sample size is reached", () => {
    const result = simulateOriginalNormal({
      mean: 1,
      standardDeviation: 10,
      sampleSize: 100,
      seed: 3
    });

    expect(result.values).toHaveLength(100);
    expect(result.values.every((value) => value > 0)).toBe(true);
  });

  it("widens multiplicative growth as steps and volatility increase", () => {
    const narrow = simulateMultiplicativeGrowth({
      startValue: 100,
      growthFactorMean: 1,
      growthFactorVolatility: 0.02,
      steps: 5,
      sampleSize: 500,
      seed: 7
    });
    const wide = simulateMultiplicativeGrowth({
      startValue: 100,
      growthFactorMean: 1,
      growthFactorVolatility: 0.2,
      steps: 50,
      sampleSize: 500,
      seed: 7
    });

    expect(wide.logWidth).toBeGreaterThan(narrow.logWidth * 10);
  });

  it("validates regular-space multiplicative inputs", () => {
    expect(() =>
      simulateMultiplicativeGrowth({
        startValue: 0,
        growthFactorMean: 1,
        growthFactorVolatility: 0.1,
        steps: 1,
        sampleSize: 10,
        seed: 1
      })
    ).toThrow(/startValue must be positive/i);

    expect(() =>
      simulateMultiplicativeGrowth({
        startValue: 100,
        growthFactorMean: 0,
        growthFactorVolatility: 0.1,
        steps: 1,
        sampleSize: 10,
        seed: 1
      })
    ).toThrow(/growthFactorMean must be positive/i);

    expect(() =>
      simulateMultiplicativeGrowth({
        startValue: 100,
        growthFactorMean: 1,
        growthFactorVolatility: -0.1,
        steps: 1,
        sampleSize: 10,
        seed: 1
      })
    ).toThrow(/growthFactorVolatility must be a non-negative/i);
  });
});
