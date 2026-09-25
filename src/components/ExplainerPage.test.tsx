import { render, screen, within } from "@testing-library/react";
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
      "Step 5 — Add up the density at each fractional value",
      "Wide is an approximation, not a guarantee"
    ]);
  });

  it("includes the wrapped-density explanation and real-data caveat", () => {
    render(<ExplainerPage />);

    expect(
      screen.getByText(/Step 3 showed that Benford requires the fractional part of log₁₀\(X\) to be nearly uniform/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/for 0\.2, that is 2\.2, 3\.2, 4\.2, and so on/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/narrow Normal gives very unequal totals.*wide Normal.*totals close to 1/i)
    ).toBeInTheDocument();
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
    expect(
      screen.getByText(/requires log₁₀\(M\) to be approximately uniform across \[0, 1\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/probability mass function of the Benford Distribution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first digit three interval example/i)).toBeInTheDocument();
    expect(screen.getByText(/Setting k = 3 gives.*0.125/i)).toBeInTheDocument();
    expect(screen.getByText(/about 12.5 percent of values have first digit 3/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /key requirement is that log₁₀\(M\), or equivalently \{log₁₀\(X\)\}, the fractional part of log₁₀\(X\)/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/not a fraud detector/i)).toBeInTheDocument();
    expect(screen.getByText(/powers of 10.*first digit 1/i)).toBeInTheDocument();
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

  it("defines K and M before carrying the decomposition into Step 3", () => {
    render(<ExplainerPage />);

    expect(
      screen.getByText(/order of magnitude \(K\).*significand \(M\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Multiplying M by 10ᴷ shifts its decimal point without changing its first digit/i).closest(".digit-shift-note")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/In other words, the first digit D is k when the significand M is between k and k \+ 1/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/3\.14 × 10³ has significand M = 3\.14.*3 ≤ 3\.14 < 4.*first digit is 3/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/P\(D = k\) means the probability.*first digit is k/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/significand determines the first digit/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/first-digit event written as a probability/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/first-digit event translated to the log scale/i)
    ).toBeInTheDocument();
  });

  it("identifies the fractional part of log X with the log of the significand", () => {
    render(<ExplainerPage />);

    expect(
      screen.getByLabelText(/fractional part of log base ten X equals log base ten M/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/K is an integer.*fractional part of log₁₀\(X\) is log₁₀\(M\)/i)
    ).toBeInTheDocument();
  });

  it("separates the Benford condition from a mechanism that can produce it", () => {
    render(<ExplainerPage />);

    const conditionPhase = screen.getByRole("region", {
      name: /what Benford requires/i
    });
    const mechanismPhase = screen.getByRole("region", {
      name: /how multiplicative processes can produce it/i
    });

    expect(
      within(conditionPhase).getByRole("heading", { name: /step 1/i })
    ).toBeInTheDocument();
    expect(
      within(conditionPhase).getByRole("heading", { name: /step 3/i })
    ).toBeInTheDocument();
    expect(
      within(conditionPhase).queryByRole("heading", { name: /step 4/i })
    ).not.toBeInTheDocument();
    expect(
      within(mechanismPhase).getByRole("heading", { name: /step 4/i })
    ).toBeInTheDocument();
    expect(
      within(mechanismPhase).getByRole("heading", { name: /step 5/i })
    ).toBeInTheDocument();
  });

  it("keeps Step 5 concise until the reader opens the detailed math", () => {
    render(<ExplainerPage />);

    const details = screen.getByText("See the math and density comparison").closest("details");
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByRole("button", { name: /^play$/i })).toBeInTheDocument();
  });

  it("connects the significand range to the uniform-log requirement", () => {
    render(<ExplainerPage />);

    expect(screen.getByText(/Step 2 defined 1 ≤ M < 10/i)).toBeInTheDocument();
    expect(screen.getAllByText(/0 ≤ log₁₀\(M\) < 1/i)).toHaveLength(2);
    expect(
      screen.getByText(/range alone does not imply Benford's Law/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/requires log₁₀\(M\) to be approximately uniform across \[0, 1\)/i)
    ).toBeInTheDocument();
  });
});
