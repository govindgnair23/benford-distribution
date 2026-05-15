import { describe, expect, it } from "vitest";

import {
  simulateDirectLognormal,
  simulateMultiplicativeGrowth
} from "./simulation";

describe("simulation", () => {
  it("samples log10(X) directly and derives X by exponentiating", () => {
    const result = simulateDirectLognormal({
      mu: 3.2,
      sigma: 0.1,
      sampleSize: 3,
      seed: 12
    });

    expect(result.values).toHaveLength(3);
    expect(result.values.every((value) => value > 0)).toBe(true);
    expect(result.logSamples).toEqual([
      expect.closeTo(3.340256, 5),
      expect.closeTo(3.297347, 5),
      expect.closeTo(3.393129, 5)
    ]);
    expect(result.values).toEqual(
      result.logSamples.map((logValue) => expect.closeTo(10 ** logValue, 8))
    );
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
