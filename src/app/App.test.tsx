import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("renders the StatQuest shell with the applet catalog", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /statquest/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /applet library/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open benford emergence lab/i })
    ).toBeInTheDocument();
  });

  it("starts on the catalog instead of inside the Benford applet", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /applet library/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /what is benford's law/i })
    ).not.toBeInTheDocument();
  });

  it("opens Benford as the first available applet", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /open benford emergence lab/i })
    );

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /back to applet library/i })
    ).toBeInTheDocument();
  });

  it("preserves Benford's internal definition, explainer, and simulation tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /open benford emergence lab/i })
    );

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

  it("supports keyboard use from the catalog into Benford tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByRole("button", { name: /open benford/i })).toHaveFocus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();

    await user.tab();
    expect(
      screen.getByRole("button", { name: /back to applet library/i })
    ).toHaveFocus();

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
