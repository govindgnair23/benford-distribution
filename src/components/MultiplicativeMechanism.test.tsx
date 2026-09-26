import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MultiplicativeMechanism } from "./MultiplicativeMechanism";

describe("MultiplicativeMechanism", () => {
  it("explains when fractional logs become nearly uniform in two visible steps", () => {
    render(<MultiplicativeMechanism />);

    expect(
      screen.getByRole("heading", { name: /when fractional logs become nearly uniform/i })
    ).toBeInTheDocument();
    const products = screen.getByRole("heading", { name: /products become sums/i });
    const spread = screen.getByRole("heading", { name: /a wider Normal log distribution gives nearly uniform fractional logs/i });
    expect(products.closest("details")).toBeNull();
    expect(spread.closest("details")).toBeNull();
    expect(products.compareDocumentPosition(spread) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("uses independent multipliers and distinguishes the CLT from uniformity", () => {
    render(<MultiplicativeMechanism />);

    expect(screen.getByText(/factor drawn uniformly.*independently of all previous draws/i)).toBeInTheDocument();
    expect(screen.getByText(/central limit theorem explains the Normal approximation.*does not by itself establish uniform fractional logs/i)).toBeInTheDocument();
    expect(screen.queryByText(/city|census|population counts/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/value as a product of independent factors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/log value as a sum of log factors/i)).toBeInTheDocument();
    expect(screen.getByText(/Normality is not required/i)).toBeInTheDocument();
  });

  it("shows the density-stacking animation openly and keeps only the formal math optional", () => {
    render(<MultiplicativeMechanism />);

    expect(screen.getByRole("button", { name: /^play$/i }).closest("details")).toBeNull();
    expect(screen.getByText(/ten fractional positions.*entire interval/i)).toBeInTheDocument();
    const math = screen.getByText("See the math").closest("details");
    expect(math).not.toHaveAttribute("open");
    expect(screen.getByLabelText("Wrapped density formula")).toBeInTheDocument();
    expect(screen.getByText(/fractional part of -2.8 is -2.8 - \(-3\) = 0.2/i)).toBeInTheDocument();
  });

  it("keeps the caveat visible", () => {
    render(<MultiplicativeMechanism />);
    const caveat = screen.getByRole("heading", { name: /a wide range alone is not enough/i });
    expect(caveat.closest("details")).toBeNull();
    expect(screen.getByText(/powers of 10.*first digit 1/i)).toBeInTheDocument();
  });
});
