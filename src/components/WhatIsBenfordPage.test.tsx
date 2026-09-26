import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatIsBenfordPage } from "./WhatIsBenfordPage";

describe("WhatIsBenfordPage", () => {
  it("introduces the broader leading-digit law before the first-digit example", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/Benford's Law describes the distribution of leading digits in some datasets, whether we examine the first digit alone or the first two together\./i)).toBeInTheDocument();
    expect(screen.getByText(/This applet focuses on the first digit: about 30% of values begin with 1, while fewer than 5% begin with 9\./i)).toBeInTheDocument();
    expect(screen.queryByText(/Compare its predictions with equally likely digits below\./i)).not.toBeInTheDocument();
  });

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

  it("keeps the PMF chart comparison without a separate comparison band", () => {
    render(<WhatIsBenfordPage />);

    expect(
      screen.getByLabelText(/benford probability mass function for first digits/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/11\.1% uniform expectation/i)).toBeInTheDocument();
    expect(screen.queryByText(/uniform first-digit intuition/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^benford shape$/i)).not.toBeInTheDocument();
  });

  it("shows three representative candidates with one shared caveat", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.getByText(/populations and city sizes/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction and accounting amounts/i)).toBeInTheDocument();
    expect(screen.getByText(/scientific measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/not guaranteed/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /river lengths/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /market and economic quantities/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/assigned identifiers/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fractional logs are spread roughly evenly/i)).not.toBeInTheDocument();
  });

  it("does not repeat the leading-digit ordering or digit-one callout", () => {
    render(<WhatIsBenfordPage />);

    expect(screen.queryByText(/digit 1 is most common and digit 9 is least/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/about 30\.1% of benford values begin with 1/i)).not.toBeInTheDocument();
  });
});
