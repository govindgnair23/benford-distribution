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
    expect(
      screen.getByRole("option", { name: /lognormal model/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /multiplicative growth model/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^narrow$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^transitional$/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /^wide$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^mu$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^sigma$/i)).toBeInTheDocument();
    expect(screen.getByText(/log10\(X\) values cluster tightly/i)).toBeInTheDocument();
    expect(screen.getByText(/log10\(X\) starts spreading/i)).toBeInTheDocument();
    expect(screen.getByText(/log10\(X\) spans many orders/i)).toBeInTheDocument();
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
      screen.getByText(/X_final = X_start \* G_1 \* G_2 \* ... \* G_n/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/typical multiplier per step/i)).toBeInTheDocument();
    expect(screen.getByText(/higher values widen the final distribution faster/i)).toBeInTheDocument();
    expect(screen.getByText(/more multiplications give more opportunities/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/starting value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/average growth factor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/growth factor volatility/i)).toBeInTheDocument();
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
