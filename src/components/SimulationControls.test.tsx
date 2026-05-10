import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SimulationControls } from "./SimulationControls";
import { presets } from "../lib/presets";

describe("SimulationControls", () => {
  it("presents lognormal model presets with learner definitions", () => {
    render(
      <SimulationControls
        config={presets.narrow}
        onChange={vi.fn()}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/model/i)).toHaveValue("direct");
    expect(screen.getByRole("option", { name: /lognormal model/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /multiplicative growth model/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^narrow$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^transitional$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^wide$/i })).toBeInTheDocument();
    expect(screen.getByText(/less than one order of magnitude/i)).toBeInTheDocument();
    expect(screen.getByText(/may move toward Benford but still show structure/i)).toBeInTheDocument();
    expect(screen.getByText(/span many orders of magnitude/i)).toBeInTheDocument();
  });

  it("switches to the multiplicative preset when the multiplicative model is selected", async () => {
    const user = userEvent.setup();
    const onPresetChange = vi.fn();

    render(
      <SimulationControls
        config={presets.narrow}
        onChange={vi.fn()}
        onPresetChange={onPresetChange}
        onRerun={vi.fn()}
      />
    );

    await user.selectOptions(screen.getByLabelText(/model/i), "multiplicative");

    expect(onPresetChange).toHaveBeenCalledWith("multiplicative");
  });

  it("explains multiplicative growth parameters in multiplicative mode", () => {
    render(
      <SimulationControls
        config={presets.multiplicative}
        onChange={vi.fn()}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(
      screen.getByText(/log10\(X_final\) = log10\(X_start\) \+ sum of random growth increments/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/average log10 change added at each step/i)).toBeInTheDocument();
    expect(screen.getByText(/higher volatility widens the final log distribution faster/i)).toBeInTheDocument();
    expect(screen.getByText(/more opportunities for log increments to accumulate/i)).toBeInTheDocument();
  });

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
