import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { WrapAnimation } from "./WrapAnimation";

// Reduced motion makes every stacking step instant, so tests can assert end states.
function preferReducedMotion() {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined
      }) as unknown as MediaQueryList
  );
}

describe("WrapAnimation", () => {
  beforeEach(preferReducedMotion);
  afterEach(() => vi.unstubAllGlobals());

  it("starts still with no fractional value stacked yet", () => {
    render(<WrapAnimation />);

    expect(screen.getByRole("button", { name: /^play$/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /0 of 10 fractional values stacked/i })).toBeInTheDocument();
    expect(screen.getByText(/press play/i)).toBeInTheDocument();
  });

  it("stacks one fractional value at a time with Next value", () => {
    render(<WrapAnimation />);

    fireEvent.click(screen.getByRole("button", { name: /next value/i }));
    expect(screen.getByRole("img", { name: /1 of 10 fractional values stacked/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next value/i }));
    expect(screen.getByRole("img", { name: /2 of 10 fractional values stacked/i })).toBeInTheDocument();
  });

  it("writes out the density sum for fractional value 0.2", () => {
    render(<WrapAnimation />);

    expect(screen.getByText(/fractional value/i, { selector: ".stack-readout-lead" })).toHaveTextContent("0.2");
    expect(screen.getByText(/total =/i)).toHaveTextContent(/f\(3\.2\) 3\.989.*= 3\.989/);
  });

  it("shows narrow totals are not uniform and wide totals are", () => {
    render(<WrapAnimation />);

    fireEvent.click(screen.getByRole("button", { name: /^play$/i }));
    expect(screen.getByText(/which is not uniform/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /very wide/i }));
    expect(screen.getByRole("button", { name: /very wide/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/the result is uniform/i)).toBeInTheDocument();
  });

  it("lets readers set the spread with a slider", () => {
    render(<WrapAnimation />);

    const slider = screen.getByLabelText(/spread of log₁₀\(X\)/i);
    fireEvent.change(slider, { target: { value: "1000" } });
    expect(screen.getByText("2.00")).toBeInTheDocument();
  });

  it("compares the resulting first digits with Benford", () => {
    render(<WrapAnimation />);

    expect(screen.getByRole("img", { name: /first-digit shares.*benford/i })).toBeInTheDocument();
  });
});
