import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimulationLab } from "./SimulationLab";

describe("SimulationLab", () => {
  it("omits the separate advanced model lab", () => {
    render(<SimulationLab />);

    expect(screen.getByRole("heading", { name: /add vs multiply/i })).toBeInTheDocument();
    expect(screen.queryByText(/advanced model controls/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("form", { name: /simulation controls/i })).not.toBeInTheDocument();
  });

  it("keeps the add vs multiply comparison as the Simulations workspace", () => {
    render(<SimulationLab />);

    expect(screen.getByRole("heading", { name: "Simulations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /add vs multiply/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^play$/i })).toBeInTheDocument();
    expect(screen.getByText(/compare additive and multiplicative processes/i)).toBeInTheDocument();
  });
});
