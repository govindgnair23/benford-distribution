import { describe, expect, it } from "vitest";

import { presets } from "./presets";

describe("presets", () => {
  it("provides narrow, wide, and multiplicative guided scenarios", () => {
    expect(presets.narrow.mode).toBe("direct");
    expect(presets.narrow.direct.sigma).toBeLessThan(0.25);
    expect(presets.wide.direct.sigma).toBeGreaterThan(0.6);
    expect(presets.multiplicative.mode).toBe("multiplicative");
    expect(presets.multiplicative.multiplicative.steps).toBeGreaterThan(1);
  });
});
