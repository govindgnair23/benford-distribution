import { describe, expect, it } from "vitest";

import { presets } from "./presets";

describe("presets", () => {
  it("provides Normal-space guided scenarios with increasing width", () => {
    expect(presets.narrow.mode).toBe("direct");
    expect(presets.narrow.direct.standardDeviation).toBeLessThan(
      presets.transitional.direct.standardDeviation
    );
    expect(presets.transitional.direct.standardDeviation).toBeLessThan(
      presets.wide.direct.standardDeviation
    );
    expect(presets.narrow.direct.mean).toBeGreaterThan(0);
    expect(presets.wide.direct.standardDeviation).toBeGreaterThan(
      presets.wide.direct.mean
    );
  });

  it("provides multiplicative presets with regular-space factor inputs", () => {
    expect(presets.multiplicative.mode).toBe("multiplicative");
    expect(presets.multiplicative.multiplicative.steps).toBeGreaterThan(1);
    expect(presets.multiplicative.multiplicative.startValue).toBeGreaterThan(0);
    expect(presets.multiplicative.multiplicative.growthFactorMean).toBeGreaterThan(0);
    expect(
      presets.multiplicative.multiplicative.growthFactorVolatility
    ).toBeGreaterThanOrEqual(0);
  });
});
