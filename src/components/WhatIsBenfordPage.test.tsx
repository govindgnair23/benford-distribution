import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatIsBenfordPage } from "./WhatIsBenfordPage";

describe("WhatIsBenfordPage", () => {
  it("defines Benford's Law with the PMF and digit-one calculation", () => {
    render(<WhatIsBenfordPage />);

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/benford probability mass function formula/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/probability of first digit one/i)).toBeInTheDocument();
    expect(
      screen.getByText(/P\(D=d\)=\\log_\{10\}\\left\(\\frac\{d\+1\}\{d\}\\right\)/i)
    ).not.toBeNull();
    expect(screen.getAllByText(/30.1%/i).length).toBeGreaterThan(0);
  });

  it("contrasts Benford with a uniform digit expectation", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/uniform first-digit intuition/i)).toBeInTheDocument();
    expect(screen.getByText(/benford shape/i)).toBeInTheDocument();
    expect(screen.getByText(/not uniform over digits/i)).toBeInTheDocument();
  });

  it("lists cautious real-world scenarios and non-examples", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/populations and city sizes/i)).toBeInTheDocument();
    expect(screen.getByText(/river lengths/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction and accounting amounts/i)).toBeInTheDocument();
    expect(screen.getByText(/scientific measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/not guaranteed/i)).toBeInTheDocument();
    expect(screen.getByText(/assigned identifiers/i)).toBeInTheDocument();
  });
});
