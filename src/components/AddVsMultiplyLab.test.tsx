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
    expect(screen.getByRole("region", { name: /multiply by a random percentage/i })).toBeInTheDocument();
  });

  it("opens on the final step: adding is not Benford, multiplying is", () => {
    render(<AddVsMultiplyLab />);

    const add = screen.getByRole("region", { name: /add a random amount/i });
    const multiply = screen.getByRole("region", { name: /multiply by a random percentage/i });
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
      screen.getByText(/spreads values smoothly across several orders of magnitude/i)
    ).toBeInTheDocument();
  });
});
