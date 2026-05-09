import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SimulationControls } from "./SimulationControls";
import { presets } from "../lib/presets";

describe("SimulationControls", () => {
  it("clamps sample size through input bounds", () => {
    const onChange = vi.fn();

    render(
      <SimulationControls
        config={presets.narrow}
        onChange={onChange}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/sample size/i)).toHaveAttribute("min", "100");
    expect(screen.getByLabelText(/sample size/i)).toHaveAttribute("max", "50000");
  });
});
