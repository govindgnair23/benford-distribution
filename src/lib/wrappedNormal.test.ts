import { describe, expect, it } from "vitest";

import {
  normalDensity,
  shiftedDensityContributions,
  wrappedDensitySum
} from "./wrappedNormal";

describe("wrapped normal density helpers", () => {
  it("computes higher density near the Normal center", () => {
    expect(normalDensity(3.2, 3.2, 0.1)).toBeGreaterThan(
      normalDensity(3.7, 3.2, 0.1)
    );
  });

  it("shows narrow wrapped densities differ more than wide wrapped densities", () => {
    const narrowAtCenterResidue = wrappedDensitySum({
      mean: 3.2,
      standardDeviation: 0.1,
      residue: 0.2,
      minShift: -6,
      maxShift: 12
    });
    const narrowAwayFromCenter = wrappedDensitySum({
      mean: 3.2,
      standardDeviation: 0.1,
      residue: 0.7,
      minShift: -6,
      maxShift: 12
    });
    const wideAtCenterResidue = wrappedDensitySum({
      mean: 3.2,
      standardDeviation: 10,
      residue: 0.2,
      minShift: -40,
      maxShift: 46
    });
    const wideAwayFromCenter = wrappedDensitySum({
      mean: 3.2,
      standardDeviation: 10,
      residue: 0.7,
      minShift: -40,
      maxShift: 46
    });

    expect(narrowAtCenterResidue).toBeGreaterThan(narrowAwayFromCenter * 1000);
    expect(Math.abs(wideAtCenterResidue - wideAwayFromCenter)).toBeLessThan(
      Math.abs(narrowAtCenterResidue - narrowAwayFromCenter)
    );
  });

  it("returns integer-shift contribution positions that preserve the residue", () => {
    const contributions = shiftedDensityContributions({
      mean: 3.2,
      standardDeviation: 0.1,
      residue: 0.2,
      minShift: 2,
      maxShift: 4
    });

    expect(contributions.map((point) => point.shift)).toEqual([2, 3, 4]);
    expect(contributions.map((point) => point.x)).toEqual([2.2, 3.2, 4.2]);
  });

  it("returns the explicit narrow and wide contribution windows", () => {
    const narrowPointTwo = shiftedDensityContributions({
      mean: 3.2,
      standardDeviation: 0.1,
      residue: 0.2,
      minShift: 2,
      maxShift: 4
    });
    const narrowPointSeven = shiftedDensityContributions({
      mean: 3.2,
      standardDeviation: 0.1,
      residue: 0.7,
      minShift: 2,
      maxShift: 4
    });
    const widePointTwo = shiftedDensityContributions({
      mean: 3.2,
      standardDeviation: 10,
      residue: 0.2,
      minShift: -27,
      maxShift: 29
    });
    const widePointSeven = shiftedDensityContributions({
      mean: 3.2,
      standardDeviation: 10,
      residue: 0.7,
      minShift: -27,
      maxShift: 29
    });

    expect(narrowPointTwo.map((point) => point.x)).toEqual([2.2, 3.2, 4.2]);
    expect(narrowPointSeven.map((point) => point.x)).toEqual([
      2.7, 3.7, 4.7
    ]);
    expect(widePointTwo[0].x).toBe(-26.8);
    expect(widePointTwo.at(-1)?.x).toBe(29.2);
    expect(widePointSeven[0].x).toBe(-26.3);
    expect(widePointSeven.at(-1)?.x).toBe(29.7);
  });

  it("rejects non-positive standard deviations", () => {
    expect(() => normalDensity(3.2, 3.2, 0)).toThrow(
      /positive standard deviation/i
    );
  });
});
