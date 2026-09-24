import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OriginalValueHistogram } from "./OriginalValueHistogram";

describe("OriginalValueHistogram", () => {
  it("explains when extreme values compress most observations into one linear bin", () => {
    render(
      <OriginalValueHistogram
        values={[...Array.from({ length: 99 }, () => 1), 1_000_000_000]}
      />
    );

    expect(screen.getByText(/99 of 100 values fall in one bin/i)).toBeInTheDocument();
    expect(screen.getByText(/extreme values stretch the linear axis/i)).toBeInTheDocument();
  });
});
