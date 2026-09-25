import { describe, expect, it } from "vitest";

import { expectedBenfordSamplingRmse } from "./diagnostics";
import {
  benfordVerdict,
  defaultAddVsMultiplyConfig,
  simulateAddVsMultiply
} from "./addVsMultiply";

describe("simulateAddVsMultiply", () => {
  const run = simulateAddVsMultiply(defaultAddVsMultiplyConfig);
  const noise = expectedBenfordSamplingRmse(defaultAddVsMultiplyConfig.sampleSize);

  it("summarizes every step from 0 through the last", () => {
    expect(run.add.steps).toHaveLength(defaultAddVsMultiplyConfig.steps + 1);
    expect(run.multiply.steps).toHaveLength(defaultAddVsMultiplyConfig.steps + 1);
  });

  it("starts both processes at the same value", () => {
    // Every value starts at 100, so every first digit is 1.
    expect(run.add.steps[0].firstDigitShares[0]).toBe(1);
    expect(run.multiply.steps[0].firstDigitShares[0]).toBe(1);
  });

  it("is reproducible for the same seed", () => {
    const again = simulateAddVsMultiply(defaultAddVsMultiplyConfig);
    expect(again.multiply.steps[50].benfordRmse).toBe(run.multiply.steps[50].benfordRmse);
    expect(again.add.paths[0]).toEqual(run.add.paths[0]);
  });

  it("keeps adding within one order of magnitude and far from Benford", () => {
    const last = run.add.steps.at(-1)!;
    expect(last.upperLog - last.lowerLog).toBeLessThan(0.2);
    expect(last.benfordRmse).toBeGreaterThan(6 * noise);
  });

  it("spreads multiplying across orders of magnitude and reaches Benford", () => {
    const last = run.multiply.steps.at(-1)!;
    expect(last.upperLog - last.lowerLog).toBeGreaterThan(2);
    expect(last.benfordRmse).toBeLessThan(2 * noise);
  });

  it("reports a fractional-log density that averages to 1", () => {
    const density = run.multiply.steps[100].fractionalDensity;
    expect(density).toHaveLength(20);
    const mean = density.reduce((sum, value) => sum + value, 0) / density.length;
    expect(mean).toBeCloseTo(1, 10);
  });

  it("returns a few example paths and a log range that contains them", () => {
    expect(run.multiply.paths).toHaveLength(6);
    for (const path of run.multiply.paths) {
      expect(path).toHaveLength(defaultAddVsMultiplyConfig.steps + 1);
      for (const value of path) {
        expect(value).toBeGreaterThanOrEqual(run.multiply.logRange.min);
        expect(value).toBeLessThanOrEqual(run.multiply.logRange.max);
      }
    }
  });
});

describe("benfordVerdict", () => {
  const noise = expectedBenfordSamplingRmse(4000);

  it("grades the gap relative to sampling noise", () => {
    expect(benfordVerdict(1.5 * noise, 4000)).toBe("close");
    expect(benfordVerdict(4 * noise, 4000)).toBe("closer");
    expect(benfordVerdict(10 * noise, 4000)).toBe("far");
  });
});
