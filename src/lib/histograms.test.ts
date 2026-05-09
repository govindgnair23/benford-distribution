import { describe, expect, it } from "vitest";

import { histogram } from "./histograms";

describe("histogram", () => {
  it("preserves all samples across bins", () => {
    const bins = histogram([0, 0.1, 0.24, 0.25, 0.99], {
      binCount: 4,
      min: 0,
      max: 1
    });

    expect(bins.map((bin) => bin.count)).toEqual([3, 1, 0, 1]);
    expect(bins.reduce((sum, bin) => sum + bin.count, 0)).toBe(5);
  });

  it("keeps a max-boundary value in the final bin", () => {
    const bins = histogram([1], { binCount: 4, min: 0, max: 1 });

    expect(bins.map((bin) => bin.count)).toEqual([0, 0, 0, 1]);
  });
});
