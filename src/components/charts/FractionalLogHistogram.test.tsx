import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FractionalLogHistogram } from "./FractionalLogHistogram";

describe("FractionalLogHistogram", () => {
  it("summarizes bins across the unit interval", () => {
    render(<FractionalLogHistogram values={[0.02, 0.12, 0.52, 0.99]} />);

    expect(screen.getByText(/fractional-log histogram/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4 values across 10 bins/i)).toHaveLength(2);
    expect(screen.getByLabelText(/fractional logs are the direct diagnostic/i)).toBeInTheDocument();
  });
});
