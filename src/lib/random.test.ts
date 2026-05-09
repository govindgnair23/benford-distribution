import { describe, expect, it } from "vitest";

import { createSeededRandom, normalRandom } from "./random";

describe("seeded random helpers", () => {
  it("replays the same uniform sequence for the same seed", () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);

    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("generates stable normal samples for a seed", () => {
    const random = createSeededRandom(12);

    expect(normalRandom(random)).toBeCloseTo(1.402557, 5);
    expect(normalRandom(random)).toBeCloseTo(0.973473, 5);
  });
});
