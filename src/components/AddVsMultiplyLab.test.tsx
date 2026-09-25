import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AddVsMultiplyLab } from "./AddVsMultiplyLab";

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

describe("AddVsMultiplyLab", () => {
  beforeEach(preferReducedMotion);
  afterEach(() => vi.unstubAllGlobals());

  it("compares an adding process with a multiplying process", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.getByRole("heading", { name: /add vs multiply/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /add a random amount/i })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: /apply a random percentage change/i })).toBeInTheDocument();
    expect(screen.queryByText(/left one|right one/i)).not.toBeInTheDocument();
  });

  it("opens on the final step: adding is not Benford, multiplying is", () => {
    render(<AddVsMultiplyLab />);

    const add = screen.getByRole("region", { name: /add a random amount/i });
    const multiply = screen.getByRole("region", { name: /apply a random percentage change/i });
    expect(within(add).getByText("Not Benford")).toBeInTheDocument();
    expect(within(multiply).getByText("Close to Benford")).toBeInTheDocument();
  });

  it("lets readers scrub back to step 0, where neither is Benford", () => {
    render(<AddVsMultiplyLab />);

    fireEvent.change(screen.getByLabelText(/number of steps so far/i), { target: { value: "0" } });
    expect(screen.getByText(/0 of 200/)).toBeInTheDocument();
    expect(screen.getAllByText("Not Benford")).toHaveLength(2);
  });

  it("describes how many orders of magnitude each process spans", () => {
    render(<AddVsMultiplyLab />);

    const add = screen.getByRole("region", { name: /add a random amount/i });
    expect(within(add).getByText(/0\.\d\d orders of magnitude/)).toBeInTheDocument();
  });

  it("compares first digits with Benford for each process", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.getByRole("img", { name: /adding first digits.*benford/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /multiplying first digits.*benford/i })).toBeInTheDocument();
  });

  it("plays through every step under reduced motion", () => {
    render(<AddVsMultiplyLab />);

    fireEvent.change(screen.getByLabelText(/number of steps so far/i), { target: { value: "10" } });
    fireEvent.click(screen.getByRole("button", { name: /^play$/i }));
    expect(screen.getByText(/200 of 200/)).toBeInTheDocument();
  });

  it("states the takeaway", () => {
    render(<AddVsMultiplyLab />);

    expect(
      screen.getByText(/fractional logs become nearly uniform/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/most common way/i)).not.toBeInTheDocument();
  });

  it("labels the comparison metric as digit RMSE in percentage points", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.getAllByText(/digit rmse/i).length).toBeGreaterThanOrEqual(3);
    expect(screen.queryByText(/average gap/i)).not.toBeInTheDocument();
  });

  it("groups corresponding charts and keeps density diagnostics optional", () => {
    render(<AddVsMultiplyLab />);

    const digits = screen.getByRole("region", { name: /first-digit shares/i });
    const spread = screen.getByRole("region", { name: /spread of values/i });
    const diagnostics = screen.getByText(/fractional-log density diagnostics/i).closest("details");

    expect(digits.compareDocumentPosition(spread) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(diagnostics).not.toHaveAttribute("open");
    expect(screen.getAllByText(/share of values \(%\)/i)).toHaveLength(2);
    expect(
      within(diagnostics as HTMLElement).getAllByText(/^density$/i, { selector: ".avm-chart-label" })
    ).toHaveLength(2);
  });

  it("describes the sampling band as a heuristic reference rather than a cutoff", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.getByText(/heuristic reference at twice the rms sampling error/i)).toBeInTheDocument();
    expect(screen.getByText(/not a confidence interval or a pass\/fail cutoff/i)).toBeInTheDocument();
    expect(screen.getByText(/within the shaded band/i)).toBeInTheDocument();
  });

  it("qualifies the multiplication result when percentage changes stay small", async () => {
    render(<AddVsMultiplyLab />);

    fireEvent.change(screen.getByLabelText(/largest change per step/i), { target: { value: "2" } });

    expect(await screen.findByText(/at the current setting, the multiplicative values remain concentrated/i)).toBeInTheDocument();
    expect(screen.getByText(/do not approach benford/i)).toBeInTheDocument();
  });
});
