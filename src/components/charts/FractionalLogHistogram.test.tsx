import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FractionalLogHistogram } from "./FractionalLogHistogram";

describe("FractionalLogHistogram", () => {
  it("summarizes bins across the unit interval", () => {
    render(<FractionalLogHistogram values={[0.02, 0.12, 0.52, 0.99]} />);

    expect(screen.getByText(/3 · fractional logs/i)).toBeInTheDocument();
    // The ChartFrame summary carries the single bin-count line now.
    expect(screen.getByText(/4 values across 10 bins/i)).toBeInTheDocument();
    expect(
      screen.getByText(/direct diagnostic for Benford behavior/i)
    ).toBeInTheDocument();
    // The visually-hidden per-bin list is still present for screen readers.
    expect(
      screen.getByLabelText(/fractional-log histogram bin counts/i)
    ).toBeInTheDocument();
  });
});
