import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WrappedNormalVisual } from "./WrappedNormalVisual";

describe("WrappedNormalVisual", () => {
  it("renders narrow and wide Normal density comparisons", () => {
    render(<WrappedNormalVisual />);

    expect(screen.getByText(/deeper look/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Narrow Normal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Normal\(3.2, 0.1\^2\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Wide Normal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Normal\(3.2, 10\^2\)/i)).toBeInTheDocument();
  });

  it("wraps every rendered chart in the design-system chart frame", () => {
    render(<WrappedNormalVisual />);

    expect(screen.getByLabelText("Narrow Normal density")).toHaveClass(
      "chart-frame"
    );
    expect(screen.getByLabelText("Narrow Normal wrapped density")).toHaveClass(
      "chart-frame"
    );
    expect(screen.getByLabelText("Wide Normal density")).toHaveClass(
      "chart-frame"
    );
    expect(screen.getByLabelText("Wide Normal wrapped density")).toHaveClass(
      "chart-frame"
    );
  });

  it("explains integer-shift contributions for r values", () => {
    render(<WrappedNormalVisual />);

    expect(
      screen.getByLabelText(/integer-shift contribution summary/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/r = 0.2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/r = 0.7/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/green lines mark R = 0.2/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/blue lines mark R = 0.7/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/2.2, 3.2, 4.2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2.7, 3.7, 4.7/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/-26.8 through 29.2/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/-26.3 through 29.7/i).length).toBeGreaterThan(
      0
    );
    expect(
      screen.getAllByText(/narrow sums are very different/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/wide sums are much closer/i).length).toBeGreaterThan(
      0
    );
  });

  it("shows wrapped density profiles across fractional positions", () => {
    render(<WrappedNormalVisual />);

    expect(
      screen.getAllByText(/wrapped density across fractional positions/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/0, 0.1, 0.2, ..., 1/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getByText(/Narrow profile peaks near R = 0.2/i)).toBeInTheDocument();
    expect(screen.getByText(/Wide profile is much flatter/i)).toBeInTheDocument();
  });

  it("shows how integer-shifted values wrap to one fractional position", () => {
    render(<WrappedNormalVisual />);

    expect(
      screen.getByRole("img", {
        name: /0.2, 1.2, and 2.2 all wrap to fractional position 0.2/i
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/keep only the fractional part/i)).toBeInTheDocument();
    expect(screen.getAllByText("0.2").length).toBeGreaterThan(1);
    expect(screen.getByText("1.2")).toBeInTheDocument();
    expect(screen.getByText("2.2")).toBeInTheDocument();
  });

  it("explains the density scale, uniform reference, and finite-window approximation", () => {
    render(<WrappedNormalVisual />);

    expect(screen.getAllByText("Density").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/uniform density = 1/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/area over an interval is its probability/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/finite range of integer shifts shown here/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/about 0.995 rather than exactly 1/i)).toBeInTheDocument();
  });
});
