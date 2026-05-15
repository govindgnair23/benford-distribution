import { describe, expect, it } from "vitest";

import { availableApplets } from "./applets";

describe("availableApplets", () => {
  it("registers Benford as the first available StatQuest applet", () => {
    expect(availableApplets[0]).toMatchObject({
      id: "benford",
      title: "Benford Emergence Lab",
      conceptArea: "Probability"
    });
  });

  it("does not expose placeholder applets as available applets", () => {
    expect(availableApplets).toHaveLength(1);
    expect(availableApplets.every((applet) => applet.component)).toBe(true);
  });
});
