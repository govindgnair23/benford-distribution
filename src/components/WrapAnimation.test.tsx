import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WrapAnimation } from "./WrapAnimation";

describe("WrapAnimation", () => {
  it("starts still and wraps matching fractional positions on demand", () => {
    render(<WrapAnimation />);

    const visual = screen.getByRole("img", { name: /2.2, 3.2, and 4.2/i });
    expect(visual).toHaveAttribute("data-stage", "before");

    fireEvent.click(screen.getByRole("button", { name: /wrap values/i }));
    expect(visual).toHaveAttribute("data-stage", "after");
    expect(screen.getByRole("button", { name: /replay wrap/i })).toBeInTheDocument();
  });

  it("lets readers compare narrow and wide wrapped densities", () => {
    render(<WrapAnimation />);

    expect(screen.getByRole("button", { name: /narrow normal/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: /narrow wrapped density/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /wide normal/i }));
    expect(screen.getByRole("button", { name: /wide normal/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img", { name: /wide wrapped density/i })).toBeInTheDocument();
    expect(screen.getByText(/closer to uniform/i)).toBeInTheDocument();
  });
});
