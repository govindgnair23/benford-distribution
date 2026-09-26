import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MultiplicativeMechanism } from "./MultiplicativeMechanism";

describe("MultiplicativeMechanism", () => {
  it("explains why fractional logs become uniform in two visible steps", () => {
    render(<MultiplicativeMechanism />);

    expect(
      screen.getByRole("heading", { name: /why fractional logs become uniform/i })
    ).toBeInTheDocument();
    const products = screen.getByRole("heading", { name: /products become sums/i });
    const spread = screen.getByRole("heading", { name: /a wide spread makes fractional logs nearly uniform/i });
    expect(products.closest("details")).toBeNull();
    expect(spread.closest("details")).toBeNull();
    expect(products.compareDocumentPosition(spread) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("ties products becoming sums to city growth", () => {
    render(<MultiplicativeMechanism />);

    expect(screen.getByText(/city.*grows by a percentage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/population as a product of growth factors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/log population as a sum/i)).toBeInTheDocument();
    expect(screen.getByText(/Normality is not required/i)).toBeInTheDocument();
  });

  it("shows the density-stacking animation openly and keeps only the formal math optional", () => {
    render(<MultiplicativeMechanism />);

    expect(screen.getByRole("button", { name: /^play$/i }).closest("details")).toBeNull();
    expect(screen.getByText(/ten fractional positions.*entire interval/i)).toBeInTheDocument();
    const math = screen.getByText("See the math and density comparison").closest("details");
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
