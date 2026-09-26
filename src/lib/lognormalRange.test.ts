import { describe, expect, it } from "vitest";
import { lognormalMiddle95 } from "./lognormalRange";

describe("lognormalMiddle95", () => {
  it("transforms the central Normal interval back to X", () => {
    const range = lognormalMiddle95(3.2, 0.25);
    expect(range.lower).toBeCloseTo(10 ** 2.71, 8);
    expect(range.upper).toBeCloseTo(10 ** 3.69, 8);
    expect(range.ordersOfMagnitude).toBeCloseTo(0.98, 10);
  });
  it("supports intervals extending below one", () => {
    const range = lognormalMiddle95(3.2, 2);
    expect(range.lower).toBeCloseTo(10 ** -0.72, 8);
    expect(range.upper).toBeCloseTo(10 ** 7.12, 5);
    expect(range.ordersOfMagnitude).toBeCloseTo(7.84, 10);
  });
});
