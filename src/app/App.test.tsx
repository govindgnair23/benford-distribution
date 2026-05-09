import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the shell with all three primary tabs", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /benford emergence lab/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /what is benford's law/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /why it happens/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /simulations/i })
    ).toBeInTheDocument();
  });

  it("starts on the definition tab before the mechanism", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /why benford happens/i })
    ).not.toBeInTheDocument();
  });

  it("switches between the definition, explainer, and simulations without navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /why it happens/i }));

    expect(
      screen.getByRole("heading", { name: /why benford happens/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /what is benford's law/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /simulations/i }));

    expect(
      screen.getByRole("heading", { name: /simulations/i })
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
      screen.getByRole("button", { name: /what is benford's law/i })
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /why it happens/i })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: /simulations/i })).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("heading", { name: /simulations/i })
    ).toBeInTheDocument();
  });
});
