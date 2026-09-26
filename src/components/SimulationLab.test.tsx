import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimulationLab } from "./SimulationLab";

describe("SimulationLab", () => {
  it("is the Why it happens page, with the mechanism before the exercise", () => {
    render(<SimulationLab />);

    expect(screen.getByRole("heading", { level: 2, name: /^why it happens$/i })).toBeInTheDocument();
    const mechanism = screen.getByRole("heading", { name: /when fractional logs become nearly uniform/i });
    const exercise = screen.getByRole("heading", { name: /exercise: which kind of town growth spreads populations across many orders of magnitude/i });
    expect(mechanism.compareDocumentPosition(exercise) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("omits the separate advanced model lab", () => {
    render(<SimulationLab />);
    expect(screen.queryByRole("form", { name: /simulation controls/i })).not.toBeInTheDocument();
  });
});
