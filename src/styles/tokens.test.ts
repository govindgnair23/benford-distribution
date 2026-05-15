import { describe, it, expect } from "vitest";
import { chartPalette } from "./tokens";

describe("chartPalette", () => {
  it("exposes exactly 4 ordered series as 6-digit hex strings", () => {
    expect(chartPalette.series).toHaveLength(4);
    for (const color of chartPalette.series) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it("series colors are all distinct", () => {
    const unique = new Set(chartPalette.series);
    expect(unique.size).toBe(chartPalette.series.length);
  });

  it("diverging pair mirrors the first two series entries", () => {
    expect(chartPalette.diverging.positive).toBe(chartPalette.series[0]);
    expect(chartPalette.diverging.negative).toBe(chartPalette.series[1]);
  });

  it("region fills are translucent rgba strings", () => {
    expect(chartPalette.regionFill.cool).toMatch(/^rgba\(.+,\s*0?\.\d+\)$/);
    expect(chartPalette.regionFill.warm).toMatch(/^rgba\(.+,\s*0?\.\d+\)$/);
  });

  it("exposes axis, gridline, and label neutrals", () => {
    expect(chartPalette.neutrals.axis).toMatch(/^#[0-9a-f]{6}$/);
    expect(chartPalette.neutrals.gridline).toMatch(/^#[0-9a-f]{6}$/);
    expect(chartPalette.neutrals.label).toMatch(/^#[0-9a-f]{6}$/);
  });
});
