import { describe, expect, it } from "vitest";

import { benfordProbability } from "./benford";
import {
  firstDigitShares,
  maxDeviationFromUniform,
  normalCdf,
  stackFractionalDensities,
  visibleShiftRange
} from "./fractionalStacks";
import { normalDensity } from "./wrappedNormal";

const tenthValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

describe("normalCdf", () => {
  it("is one half at the mean and near 0.975 at 1.96 standard deviations", () => {
    expect(normalCdf(3.2, 3.2, 0.5)).toBeCloseTo(0.5, 6);
    expect(normalCdf(3.2 + 1.96 * 0.5, 3.2, 0.5)).toBeCloseTo(0.975, 3);
  });
});

describe("visibleShiftRange", () => {
  it("covers the Normal out to 4.5 standard deviations on whole numbers", () => {
    expect(visibleShiftRange({ mean: 3.2, standardDeviation: 1 })).toEqual({
      minShift: -2,
      maxShift: 8
    });
  });

  it("widens narrow curves to span at least three whole numbers", () => {
    const { minShift, maxShift } = visibleShiftRange({
      mean: 3.2,
      standardDeviation: 0.1
    });
    expect(maxShift - minShift).toBeGreaterThanOrEqual(3);
    expect(minShift).toBeLessThanOrEqual(2);
    expect(maxShift).toBeGreaterThanOrEqual(4);
  });
});

describe("stackFractionalDensities", () => {
  it("stacks the density at every point sharing a fractional value", () => {
    const [stack] = stackFractionalDensities({
      mean: 3.2,
      standardDeviation: 0.1,
      fractionalValues: [0.2],
      minShift: 2,
      maxShift: 5
    });

    expect(stack.fractionalValue).toBe(0.2);
    expect(stack.contributions.map((point) => point.x)).toEqual([2.2, 3.2, 4.2]);
    expect(stack.contributions.map((point) => point.base)).toEqual([
      0,
      stack.contributions[0].density,
      stack.contributions[0].density + stack.contributions[1].density
    ]);
    expect(stack.contributions[1].density).toBeCloseTo(normalDensity(3.2, 3.2, 0.1), 12);
    expect(stack.total).toBeCloseTo(
      stack.contributions.reduce((sum, point) => sum + point.density, 0),
      12
    );
  });

  it("treats fractional value 1.0 as landing on whole numbers", () => {
    const [stack] = stackFractionalDensities({
      mean: 3.2,
      standardDeviation: 0.3,
      fractionalValues: [1],
      minShift: 2,
      maxShift: 5
    });
    expect(stack.contributions.map((point) => point.x)).toEqual([3, 4, 5]);
  });

  it("gives very unequal totals for a narrow Normal", () => {
    const range = visibleShiftRange({ mean: 3.2, standardDeviation: 0.1 });
    const totals = stackFractionalDensities({
      mean: 3.2,
      standardDeviation: 0.1,
      fractionalValues: tenthValues,
      ...range
    }).map((stack) => stack.total);

    expect(totals[1]).toBeGreaterThan(3.9);
    expect(totals[6]).toBeLessThan(0.001);
  });

  it("gives totals near 1 for a wide Normal", () => {
    const range = visibleShiftRange({ mean: 3.2, standardDeviation: 1.5 });
    const totals = stackFractionalDensities({
      mean: 3.2,
      standardDeviation: 1.5,
      fractionalValues: tenthValues,
      ...range
    }).map((stack) => stack.total);

    for (const total of totals) expect(total).toBeCloseTo(1, 3);
  });
});

describe("maxDeviationFromUniform", () => {
  it("is large for a narrow Normal and tiny for a wide one", () => {
    expect(maxDeviationFromUniform({ mean: 3.2, standardDeviation: 0.1 })).toBeGreaterThan(2);
    expect(maxDeviationFromUniform({ mean: 3.2, standardDeviation: 0.5 })).toBeLessThan(0.02);
  });
});

describe("firstDigitShares", () => {
  it("returns nine shares that sum to 1", () => {
    const shares = firstDigitShares({ mean: 3.2, standardDeviation: 0.25 });
    expect(shares).toHaveLength(9);
    expect(shares.reduce((sum, share) => sum + share, 0)).toBeCloseTo(1, 6);
  });

  it("puts nearly everything on digit 1 for a narrow Normal centered at 3.2", () => {
    expect(firstDigitShares({ mean: 3.2, standardDeviation: 0.03 })[0]).toBeGreaterThan(0.99);
  });

  it("matches Benford for a wide Normal", () => {
    const shares = firstDigitShares({ mean: 3.2, standardDeviation: 1.5 });
    shares.forEach((share, index) => {
      expect(share).toBeCloseTo(benfordProbability(index + 1), 4);
    });
  });
});
