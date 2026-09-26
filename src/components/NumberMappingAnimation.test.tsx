import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberMappingAnimation } from "./NumberMappingAnimation";

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("NumberMappingAnimation", () => {
  it("steps through a number, lands in its interval, and moves to another example", () => {
    render(<NumberMappingAnimation />);
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("3147");
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("First digit: 3");
    expect(screen.getByTestId("mapping-result")).toHaveTextContent("0.477 ≤ 0.498 < 0.602");
    fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("125");
    fireEvent.change(screen.getByLabelText("Example number"), { target: { value: "125" } });
    for (let i = 0; i < 4; i++) fireEvent.click(screen.getByRole("button", { name: "Next step" }));
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("First digit: 1");
  });
  it("covers all nine digits with one changing interval readout", () => {
    render(<NumberMappingAnimation />);
    const select = screen.getByLabelText("Example number");
    const options = within(select).getAllByRole("option");
    expect(options).toHaveLength(9);
    const digits = new Set<number>();
    for (const option of options) {
      const value = Number((option as HTMLOptionElement).value);
      const digit = Number(String(value).replace(/^0\./, "").replace(/^0+/, "")[0]);
      digits.add(digit);
      fireEvent.change(select, { target: { value: String(value) } });
      expect(screen.getByTestId("mapping-result")).not.toHaveTextContent("Interval length");
      for (let step = 0; step < 4; step++) fireEvent.click(screen.getByRole("button", { name: "Next step" }));
      expect(screen.getByTestId("mapping-result")).toHaveTextContent(`Digit ${digit}:`);
      expect(screen.getByTestId("mapping-result")).toHaveTextContent(`Interval length: log₁₀(${digit + 1}) − log₁₀(${digit})`);
      expect(screen.getByTestId("mapping-result")).toHaveTextContent("% of the scale");
    }
    expect([...digits].sort()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(screen.queryByLabelText("Interval boundaries and lengths")).not.toBeInTheDocument();
  });
  it("plays and pauses without advancing while paused", () => {
    vi.useFakeTimers();
    render(<NumberMappingAnimation />);
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => { vi.advanceTimersByTime(3999); });
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("Start with a positive number");
    act(() => { vi.advanceTimersByTime(1); });
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("Significand");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    const text = screen.getByTestId("mapping-stage").textContent;
    act(() => { vi.advanceTimersByTime(6000); });
    expect(screen.getByTestId("mapping-stage").textContent).toBe(text);
  });
  it("provides a still final mapping when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<NumberMappingAnimation />);
    fireEvent.click(screen.getByRole("button", { name: "Show mapping" }));
    expect(screen.getByTestId("mapping-stage")).toHaveTextContent("First digit: 3");
  });

  it("drops many numbers of varying size onto the fractional-log scale over time", () => {
    vi.useFakeTimers();
    render(<NumberMappingAnimation />);
    const crowd = screen.getByRole("region", { name: /many numbers at once/i });
    expect(within(crowd).getByText(/0 of 2,000 numbers/)).toBeInTheDocument();

    fireEvent.click(within(crowd).getByRole("button", { name: "Drop numbers" }));
    act(() => { vi.advanceTimersByTime(1000); });
    const progress = within(crowd).getByTestId("crowd-count").textContent ?? "";
    const shown = Number(progress.replace(/,/g, "").match(/\d+/)?.[0]);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(2000);
    expect(within(crowd).getByTestId("crowd-recent").textContent).not.toBe("");
  });

  it("ends with a flat fractional-log histogram and Benford first digits", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<NumberMappingAnimation />);
    const crowd = screen.getByRole("region", { name: /many numbers at once/i });
    fireEvent.click(within(crowd).getByRole("button", { name: "Drop numbers" }));

    expect(within(crowd).getByText(/2,000 of 2,000 numbers/)).toBeInTheDocument();
    expect(within(crowd).getByRole("img", { name: /fractional logs.*each tenth/i })).toBeInTheDocument();
    expect(within(crowd).getByRole("img", { name: /first digits.*benford/i })).toBeInTheDocument();
    expect(within(crowd).getByText(/roughly uniform.*but.*first digits follow benford/i)).toBeInTheDocument();
    expect(within(crowd).getByText(/landings are even, so each digit’s share ≈ its segment’s width/i)).toBeInTheDocument();
  });

  it("replaces the fixed uniform marks with real numbers", () => {
    render(<NumberMappingAnimation />);
    expect(screen.queryByRole("button", { name: /uniform illustration/i })).not.toBeInTheDocument();
  });

  it("contrasts numbers that stay within one order of magnitude", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<NumberMappingAnimation />);
    const crowd = screen.getByRole("region", { name: /many numbers at once/i });
    const narrow = within(crowd).getByRole("button", { name: /within one order of magnitude/i });
    expect(narrow).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(narrow);
    fireEvent.click(within(crowd).getByRole("button", { name: "Drop numbers" }));

    expect(narrow).toHaveAttribute("aria-pressed", "true");
    expect(within(crowd).getByText(/about 0\.\d orders of magnitude/)).toBeInTheDocument();
    expect(within(crowd).getByText(/not uniform.*first digits are not benford/i)).toBeInTheDocument();
    expect(within(crowd).getByText(/landings bunch up, so shares don’t match the widths/i)).toBeInTheDocument();
    expect(within(crowd).queryByText(/share ≈ its segment’s width/i)).not.toBeInTheDocument();
  });
});
