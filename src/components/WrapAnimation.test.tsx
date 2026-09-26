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
    expect(screen.getByRole("checkbox", { name: /show the continuous density curve/i })).toBeChecked();
    expect(screen.getByText(/density is height.*probability is area/i)).toBeInTheDocument();
    expect(screen.getByText(/on \[0, 1\).*height 1 everywhere/i)).toBeInTheDocument();
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

    expect(screen.getByText(/selected fractional position/i, { selector: ".stack-readout-lead" })).toHaveTextContent("0.2");
    expect(screen.getByText(/total =/i)).toHaveTextContent(/f\(3\.2\) 3\.989.*= 3\.989/);
  });

  it("uses fractional positions from 0.0 through 0.9", () => {
    render(<WrapAnimation />);

    fireEvent.click(screen.getByRole("button", { name: /next value/i }));
    expect(screen.getByText(/fractional position/i, { selector: ".stack-caption" })).toHaveTextContent("0.0");
    expect(screen.queryByText(/1\.0 is the same as 0\.0/i)).not.toBeInTheDocument();
  });

  it("shows narrow totals are not uniform and wide totals are", () => {
    render(<WrapAnimation />);

    fireEvent.click(screen.getByRole("button", { name: /^play$/i }));
    expect(screen.getByText(/which is not uniform/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /very wide/i }));
    expect(screen.getByRole("button", { name: /very wide/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/nearly uniform in this example/i)).toBeInTheDocument();
  });

  it("shows the middle 95% range of X beside the spread controls", () => {
    render(<WrapAnimation />);
    const range = screen.getByRole("status", { name: "Range of original values" });
    expect(range.closest("details")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /^narrow$/i }));
    expect(range).toHaveTextContent("513 to 4,900");
    expect(range).toHaveTextContent("0.98 orders of magnitude");
    fireEvent.change(screen.getByLabelText(/spread of log₁₀\(X\)/i), { target: { value: "1000" } });
    expect(range).toHaveTextContent("7.84 orders of magnitude");
    expect(range).toHaveTextContent("middle 95%");
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
    expect(screen.getByText(/model probabilities.*no sampling noise/i)).toBeInTheDocument();
    expect(screen.getByText(/share of values \(%\)/i)).toBeInTheDocument();
  });

  it("keeps secondary metrics inside diagnostic details", () => {
    render(<WrapAnimation />);

    const details = screen.getByText(/show diagnostic details/i).closest("details");
    expect(details).not.toHaveAttribute("open");
    expect(details).toHaveTextContent(/largest single-digit difference/i);
  });
});
