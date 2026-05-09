import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FirstDigitChart } from "./FirstDigitChart";

describe("FirstDigitChart", () => {
  it("renders observed first digit frequencies against Benford references", () => {
    render(<FirstDigitChart firstDigits={[1, 1, 1, 2, 9]} />);

    expect(screen.getByText(/first digits vs benford/i)).toBeInTheDocument();
    expect(screen.getByText(/D=1 observed 60.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/Benford 30.1%/i)).toBeInTheDocument();
  });
});
