import { describe, expect, it } from "vitest";

import { availableApplets, upcomingApplets } from "./applets";

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

describe("upcomingApplets", () => {
  it("lists at least one upcoming applet so the catalog reads as curated", () => {
    expect(upcomingApplets.length).toBeGreaterThanOrEqual(1);
  });

  it("upcoming entries describe a future applet without a runnable component", () => {
    for (const applet of upcomingApplets) {
      expect(applet).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        subtitle: expect.any(String),
        conceptArea: expect.any(String)
      });
      expect((applet as Record<string, unknown>).component).toBeUndefined();
    }
  });

  it("upcoming ids never collide with available applet ids", () => {
    const availableIds = new Set(availableApplets.map((applet) => applet.id));
    for (const applet of upcomingApplets) {
      expect(availableIds.has(applet.id)).toBe(false);
    }
  });
});
