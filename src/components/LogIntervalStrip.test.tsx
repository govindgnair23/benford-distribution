import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LogIntervalStrip } from "./LogIntervalStrip";

describe("LogIntervalStrip", () => {
  it("renders all first digit intervals", () => {
    render(<LogIntervalStrip />);

    for (let digit = 1; digit <= 9; digit += 1) {
      expect(screen.getByText(`D=${digit}`)).toBeInTheDocument();
    }
  });

  it("marks digit one as the largest interval", () => {
    render(<LogIntervalStrip />);

    expect(screen.getByText(/digit 1 has the largest interval/i)).toBeInTheDocument();
    expect(screen.getAllByText(/30.1%/)).toHaveLength(2);
  });
});
