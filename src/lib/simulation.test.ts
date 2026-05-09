import { describe, expect, it } from "vitest";

import {
  simulateDirectLognormal,
  simulateMultiplicativeGrowth
} from "./simulation";

describe("simulation", () => {
  it("returns deterministic direct lognormal samples for a fixed seed", () => {
    const result = simulateDirectLognormal({
      mu: 3.2,
      sigma: 0.1,
      sampleSize: 3,
      seed: 12
    });

    expect(result.logSamples).toEqual([
      expect.closeTo(3.340256, 5),
      expect.closeTo(3.297347, 5),
      expect.closeTo(3.393129, 5)
    ]);
    expect(result.fractionalLogs).toHaveLength(3);
    expect(result.firstDigits).toHaveLength(3);
  });

  it("widens multiplicative growth as steps and volatility increase", () => {
    const narrow = simulateMultiplicativeGrowth({
      log10Start: 2,
      growthMean: 0,
      growthVolatility: 0.02,
      steps: 5,
      sampleSize: 500,
      seed: 7
    });
    const wide = simulateMultiplicativeGrowth({
      log10Start: 2,
      growthMean: 0,
      growthVolatility: 0.2,
      steps: 50,
      sampleSize: 500,
      seed: 7
    });

    expect(wide.logWidth).toBeGreaterThan(narrow.logWidth * 10);
  });
});
