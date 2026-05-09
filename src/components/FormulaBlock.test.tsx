import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormulaBlock } from "./FormulaBlock";

describe("FormulaBlock", () => {
  it("renders LaTeX display math with an accessible label", () => {
    render(
      <FormulaBlock
        label="Digit one probability"
        formula={String.raw`P(D=1)=\log_{10}(2)`}
        accessibilityLabel="P of first digit one equals log base ten of two"
      />
    );

    expect(screen.getByText(/digit one probability/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/p of first digit one equals log base ten of two/i)
    ).toBeInTheDocument();
    expect(document.querySelector("code")).not.toBeInTheDocument();
    expect(document.querySelector(".katex-display")).toBeInTheDocument();
  });

  it("keeps existing text children as a compatibility fallback", () => {
    render(<FormulaBlock>X = 10^K * M</FormulaBlock>);

    expect(screen.getByText(/X = 10\^K \* M/i)).toBeInTheDocument();
  });
});
