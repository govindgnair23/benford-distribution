import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SimulationLab } from "./SimulationLab";

describe("SimulationLab", () => {
  it("starts with a narrow direct lognormal preset and non-Benford explanation", () => {
    render(<SimulationLab />);

    expect(
      screen.getByRole("heading", { name: /simulations/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/mode/i)).toHaveValue("direct");
    expect(screen.getByLabelText(/sigma/i)).toHaveValue(0.08);
    expect(screen.getByText(/not close to Benford/i)).toBeInTheDocument();
  });

  it("applies the wide preset and updates the explanation", async () => {
    const user = userEvent.setup();
    render(<SimulationLab />);

    await user.selectOptions(screen.getByLabelText(/preset/i), "wide");

    expect(screen.getByLabelText(/sigma/i)).toHaveValue(2);
    expect(screen.getByText(/close to uniform/i)).toBeInTheDocument();
  });

  it("exposes multiplicative controls in multiplicative mode", async () => {
    const user = userEvent.setup();
    render(<SimulationLab />);

    await user.selectOptions(screen.getByLabelText(/mode/i), "multiplicative");

    expect(screen.getByLabelText(/starting log10 value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/steps/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/growth volatility/i)).toBeInTheDocument();
  });

  it("reruns the same parameters with a new seed", async () => {
    const user = userEvent.setup();
    render(<SimulationLab />);

    const firstSeed = screen.getByTestId("seed-value").textContent;
    await user.click(screen.getByRole("button", { name: /rerun sample/i }));

    expect(screen.getByTestId("seed-value").textContent).not.toBe(firstSeed);
  });
});
