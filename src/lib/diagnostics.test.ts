import { describe, expect, it } from "vitest";

import { evaluateSample } from "./diagnostics";
import { simulateOriginalNormal } from "./simulation";

describe("diagnostics", () => {
  it("labels narrow samples as bunched and far from Benford", () => {
    const sample = simulateOriginalNormal({
      mean: 1000,
      standardDeviation: 80,
      sampleSize: 1000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("narrow");
    expect(diagnostics.explanation).toMatch(/concentrated/i);
    expect(diagnostics.benfordRmse).toBeGreaterThan(0.1);
  });

  it("labels wide samples as closer to Benford while centering fractional logs", () => {
    const sample = simulateOriginalNormal({
      mean: 1000,
      standardDeviation: 120000,
      sampleSize: 10000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("wide");
    expect(diagnostics.explanation).toMatch(/close to uniform/i);
    expect(diagnostics.benfordRmse).toBeLessThan(0.05);
  });
});
