import { describe, expect, it } from "vitest";

import { presets } from "./presets";

describe("presets", () => {
  it("provides lognormal guided scenarios with increasing log width", () => {
    expect(presets.narrow.mode).toBe("direct");
    expect(presets.narrow.direct.sigma).toBeLessThan(
      presets.transitional.direct.sigma
    );
    expect(presets.transitional.direct.sigma).toBeLessThan(
      presets.wide.direct.sigma
    );
    expect(presets.narrow.direct.mu).toBe(3.2);
    expect(presets.wide.direct.sigma).toBeGreaterThan(1);
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
