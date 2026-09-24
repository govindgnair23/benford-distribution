import { describe, expect, it } from "vitest";

import { evaluateSample, expectedBenfordSamplingRmse } from "./diagnostics";
import { simulateDirectLognormal } from "./simulation";

describe("diagnostics", () => {
  it("labels narrow samples as bunched and far from Benford", () => {
    const sample = simulateDirectLognormal({
      mu: 3.2,
      sigma: 0.08,
      sampleSize: 1000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("narrow");
    expect(diagnostics.explanation).toMatch(/concentrated/i);
    expect(diagnostics.benfordRmse).toBeGreaterThan(0.1);
  });

  it("describes wide log spread without treating it as a Benford guarantee", () => {
    const sample = simulateDirectLognormal({
      mu: 3.2,
      sigma: 2,
      sampleSize: 10000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("wide");
    expect(diagnostics.explanation).toMatch(/does not guarantee Benford/i);
    expect(diagnostics.explanation).toMatch(/inspect the fractional-log histogram/i);
    expect(diagnostics.benfordRmse).toBeLessThan(0.03);
  });

  it("explains that transitional first digits may already look close", () => {
    const sample = simulateDirectLognormal({
      mu: 3.2,
      sigma: 0.42,
      sampleSize: 5000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("transitional");
    expect(diagnostics.explanation).toMatch(/first digits can already look close/i);
  });

  it("computes the typical finite-sample RMSE for an exact Benford source", () => {
    expect(expectedBenfordSamplingRmse(5000)).toBeCloseTo(0.0043064, 6);
    expect(expectedBenfordSamplingRmse(20000)).toBeCloseTo(
      expectedBenfordSamplingRmse(5000) / 2,
      8
    );
  });
});
