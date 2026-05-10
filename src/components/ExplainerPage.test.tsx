import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExplainerPage } from "./ExplainerPage";

describe("ExplainerPage", () => {
  it("presents the mathematical argument in the intended order", () => {
    render(<ExplainerPage />);

    const sectionTitles = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(sectionTitles).toEqual([
      "Prerequisites",
      "Split a number into scale and significand",
      "Turn first digits into log intervals",
      "Products become sums",
      "Wrap the Normal around one order of magnitude",
      "Wide is an approximation, not a guarantee"
    ]);
  });

  it("includes the wrapped-density explanation and real-data caveat", () => {
    render(<ExplainerPage />);

    expect(screen.getByLabelText(/wrapped density formula/i)).toBeInTheDocument();
    expect(screen.getAllByText(/0.497/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/bridge is the fractional part/i)).not.toBeInTheDocument();
    expect(screen.getByText(/condition that actually matters/i)).toBeInTheDocument();
    expect(screen.getByText(/K = 3 and M = 3.14/i)).toBeInTheDocument();
    expect(screen.getByText(/log10\(10\^3\) = 3/i)).toBeInTheDocument();
    expect(screen.getByText(/If log10\(M\) is uniform/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first digit three interval example/i)).toBeInTheDocument();
    expect(screen.getByText(/For the running example, M = 3.14, so D = 3/i)).toBeInTheDocument();
    expect(
      screen.getByText(/key requirement is that log10\(M\), or equivalently \{log10\(X\)\}/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/not a fraud detector/i)).toBeInTheDocument();
  });

  it("renders core formulas with LaTeX typography", () => {
    render(<ExplainerPage />);

    expect(screen.getByLabelText(/positive number decomposition formula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/3140 equals ten cubed times 3.14/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/base ten log split into integer order and significand log/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/log base ten of 3140 equals 3 plus log base ten of 3.14/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/benford digit interval probability formula/i)).toBeInTheDocument();
    expect(document.querySelectorAll(".katex-display").length).toBeGreaterThan(3);
  });
});
