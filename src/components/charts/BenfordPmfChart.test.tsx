import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BenfordPmfChart } from "./BenfordPmfChart";

describe("BenfordPmfChart", () => {
  it("renders Benford probabilities for all first digits", () => {
    render(<BenfordPmfChart />);

    expect(screen.getByText(/benford pmf/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/benford probability mass function/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/D=1 probability 30.1%/i)).toBeInTheDocument();
    expect(screen.getByText(/D=9 probability 4.6%/i)).toBeInTheDocument();
  });
});
