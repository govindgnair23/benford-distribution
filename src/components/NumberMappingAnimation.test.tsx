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
});
