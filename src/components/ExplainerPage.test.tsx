import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExplainerPage } from "./ExplainerPage";

describe("ExplainerPage", () => {
  it("presents the mathematical argument in the intended order", () => {
    render(<ExplainerPage />);

    const sectionTitles = Array.from(
      document.querySelectorAll(".math-step > h3")
    ).map((heading) => heading.textContent);

    expect(sectionTitles).toEqual([
      "Step 1 — Prerequisites",
      "Step 2 — Split a number into scale and significand",
      "Step 3 — Turn first digits into log intervals",
      "Step 4 — Products become sums",
      "Step 5 — Wrap the Normal around one order of magnitude",
      "Wide is an approximation, not a guarantee"
    ]);
  });

  it("includes the wrapped-density explanation and real-data caveat", () => {
    render(<ExplainerPage />);

    expect(screen.getByLabelText(/wrapped density formula/i)).toBeInTheDocument();
    expect(screen.getByText(/sum is over all integer values of k/i)).toBeInTheDocument();
    expect(screen.getByText(/fractional part means x − ⌊x⌋/i)).toBeInTheDocument();
    expect(screen.getByText(/fractional part of -2.8 is -2.8 - \(-3\) = 0.2/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Normal\(3.2, 0.1\^2\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Normal\(3.2, 10\^2\)/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/For the narrow Normal, the wrapped density at 0.2 and 0.7 looks very different/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for the wide Normal, the wrapped densities look much closer/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not appear uniform; in the latter case, it approaches a uniform distribution/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Z ~ N\(3.2, 0.01\)/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/X = 3140, K = 3 and M = 3.14/i).length).toBeGreaterThan(0);
    // The former duplicate sentence at the end of Step 2 was removed.
    expect(screen.queryByText(/bridge is the fractional part/i)).not.toBeInTheDocument();
    expect(screen.getByText(/condition that actually matters/i)).toBeInTheDocument();
    expect(screen.getAllByText(/K = 3 and M = 3.14/i).length).toBe(1);
    expect(screen.queryByText(/remaining decimal part/i)).not.toBeInTheDocument();
    expect(screen.getByText(/log₁₀\(10³\) = 3/i)).toBeInTheDocument();
    expect(screen.getByText(/If log₁₀\(M\) is uniform/i)).toBeInTheDocument();
    expect(screen.getByText(/probability mass function of the Benford Distribution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first digit three interval example/i)).toBeInTheDocument();
    expect(screen.getByText(/For the running example, M = 3.14, so D = 3/i)).toBeInTheDocument();
    expect(screen.getByText(/starting digit = 3 is expected to appear only 12.3% of the time/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /key requirement is that log₁₀\(M\), or equivalently \{log₁₀\(X\)\}, the fractional part of log₁₀\(X\)/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/not a fraud detector/i)).toBeInTheDocument();
  });

  it("renders core formulas with LaTeX typography", () => {
    render(<ExplainerPage />);

    expect(screen.getByLabelText(/fractional part definition/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/positive number decomposition formula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/3140 equals ten cubed times 3.14/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/base ten log split into integer order and significand log/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/log base ten of 3140 equals 3 plus log base ten of 3.14/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/benford digit interval probability formula/i)).toBeInTheDocument();
    expect(document.querySelectorAll(".katex-display").length).toBeGreaterThan(3);
  });
});
