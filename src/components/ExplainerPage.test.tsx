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
    expect(screen.getByText(/not a fraud detector/i)).toBeInTheDocument();
  });

  it("renders core formulas with LaTeX typography", () => {
    render(<ExplainerPage />);

    expect(screen.getByLabelText(/positive number decomposition formula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/benford digit interval probability formula/i)).toBeInTheDocument();
    expect(document.querySelectorAll(".katex-display").length).toBeGreaterThan(3);
  });
});
