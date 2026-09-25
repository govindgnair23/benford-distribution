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
    expect(screen.getByText(/first nonzero digit of a positive number/i)).toBeInTheDocument();
    expect(screen.getByText(/0\.0314.*first digit 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero has no first nonzero digit; this applet considers positive values\./i)).toBeInTheDocument();
    expect(screen.queryByText(/negative values/i)).not.toBeInTheDocument();
  });

  it("contrasts Benford with a uniform digit expectation", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/uniform first-digit intuition/i)).toBeInTheDocument();
    expect(screen.getByText(/benford shape/i)).toBeInTheDocument();
    expect(screen.getByText(/not uniform over digits/i)).toBeInTheDocument();
  });

  it("lists real-world candidates without the technical caveat", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/populations and city sizes/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /river lengths/i })).toBeInTheDocument();
    expect(screen.getByText(/transaction and accounting amounts/i)).toBeInTheDocument();
    expect(screen.getByText(/scientific measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/not guaranteed/i)).toBeInTheDocument();
    expect(screen.queryByText(/assigned identifiers/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fractional logs are spread roughly evenly/i)).not.toBeInTheDocument();
    expect(screen.getByText(/river lengths.*can be candidates/i)).toBeInTheDocument();
  });
});
