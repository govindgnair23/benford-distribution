import { fireEvent, render, screen } from "@testing-library/react";
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
    expect(screen.getByLabelText(/mean of log₁₀\(X\)/i)).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", {
        name: /standard deviation of log₁₀\(X\)/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/log₁₀\(X\) ~ Normal\(μ, σ²\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/log₁₀\(X\) values cluster tightly/i)).toBeInTheDocument();
    expect(screen.getByText(/log₁₀\(X\) starts spreading/i)).toBeInTheDocument();
    expect(screen.getByText(/log₁₀\(X\) spans many orders/i)).toBeInTheDocument();
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
    expect(
      screen.getByText(/Gᵢ ~ Normal\(μ_G, σ_G²\), restricted to Gᵢ > 0/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/mean of the underlying Normal distribution before/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/standard deviation of that underlying Normal distribution/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/independent path with newly drawn factors/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/starting value/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/factor Normal mean/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /factor Normal standard deviation/i })
    ).toBeInTheDocument();
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

  it("pairs sigma with a synced slider and number input", () => {
    render(
      <SimulationControls
        config={presets.narrow}
        onChange={vi.fn()}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    const sigmaNumber = screen.getByRole("spinbutton", {
      name: /standard deviation of log₁₀\(X\)/i
    });
    const sigmaSlider = screen.getByRole("slider", {
      name: /standard deviation of log₁₀\(X\).*slider/i
    });

    expect(sigmaNumber).toHaveValue(0.08);
    expect(sigmaSlider).toHaveValue("0.08");
    expect(sigmaSlider).toHaveAttribute("min", "0");
    expect(sigmaSlider).toHaveAttribute("max", "2.5");
  });

  it("ignores empty and non-numeric edits instead of simulating invalid config", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <SimulationControls
        config={presets.narrow}
        onChange={onChange}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    const sampleSize = screen.getByLabelText(/sample size/i);
    await user.clear(sampleSize);

    // Clearing the field must not push a config with 0 / NaN sample size.
    for (const call of onChange.mock.calls) {
      const [config] = call;
      expect(Number.isFinite(config.direct.sampleSize)).toBe(true);
      expect(config.direct.sampleSize).toBeGreaterThan(0);
    }
  });

  it("clamps out-of-range sigma edits into the declared bounds", () => {
    const onChange = vi.fn();

    render(
      <SimulationControls
        config={presets.narrow}
        onChange={onChange}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    const sigmaNumber = screen.getByRole("spinbutton", {
      name: /standard deviation of log₁₀\(X\)/i
    });
    fireEvent.change(sigmaNumber, { target: { value: "9" } });

    expect(onChange).toHaveBeenCalled();
    const lastConfig = onChange.mock.calls.at(-1)?.[0];
    expect(lastConfig.direct.sigma).toBe(2.5);
  });

  it("surfaces the width-class thresholds in the lognormal guidance", () => {
    render(
      <SimulationControls
        config={presets.narrow}
        onChange={vi.fn()}
        onPresetChange={vi.fn()}
        onRerun={vi.fn()}
      />
    );

    expect(screen.getByText(/reads as narrow/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.25/)).toBeInTheDocument();
    expect(screen.getByText(/0\.6/)).toBeInTheDocument();
    expect(
      screen.getByText(/teaching categories based only on SD\(log₁₀ X\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/not thresholds for Benford conformity/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/first digits can already match Benford closely/i)
    ).toBeInTheDocument();
  });

  it("explains automatic updates and draws another sample on request", async () => {
    const user = userEvent.setup();
    const onRerun = vi.fn();

    render(
      <SimulationControls
        config={presets.narrow}
        onChange={vi.fn()}
        onPresetChange={vi.fn()}
        onRerun={onRerun}
      />
    );

    expect(
      screen.getByText(/controls update the current results automatically/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The Draw another sample button keeps these settings and uses a new random seed/i)
    ).toBeInTheDocument();
    const drawButton = screen.getByRole("button", {
      name: /draw another sample/i
    });
    await user.click(drawButton);
    expect(onRerun).toHaveBeenCalledOnce();
  });
});
