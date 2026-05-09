import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the shell with both primary pages", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /benford emergence lab/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /why benford happens/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /simulation lab/i })
    ).toBeInTheDocument();
  });

  it("switches between the explainer and simulation lab without navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /why benford happens/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /simulation lab/i }));

    expect(
      screen.getByRole("heading", { name: /simulation lab/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/adjust log width and watch fractional logs/i)
    ).toBeInTheDocument();
  });

  it("supports keyboard switching between pages", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(
      screen.getByRole("button", { name: /why benford happens/i })
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /simulation lab/i })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("heading", { name: /simulation lab/i })
    ).toBeInTheDocument();
  });
});
