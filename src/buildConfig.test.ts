import { describe, expect, it } from "vitest";

import config from "../vite.config";

describe("production build configuration", () => {
  it("keeps KaTeX command parsing intact by disabling the current minifier", () => {
    expect(config).toMatchObject({ build: { minify: false } });
  });
});
