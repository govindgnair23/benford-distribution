import { describe, expect, it } from "vitest";

import { evaluateSample } from "./diagnostics";
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

  it("labels wide samples as closer to Benford while centering fractional logs", () => {
    const sample = simulateDirectLognormal({
      mu: 3.2,
      sigma: 2,
      sampleSize: 10000,
      seed: 22
    });

    const diagnostics = evaluateSample(sample);

    expect(diagnostics.widthLabel).toBe("wide");
    expect(diagnostics.explanation).toMatch(/close to uniform/i);
    expect(diagnostics.benfordRmse).toBeLessThan(0.03);
  });
});
