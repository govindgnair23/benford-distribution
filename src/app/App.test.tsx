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
    expect(screen.getByRole("region", { name: /applet catalog/i })).toBeInTheDocument();
    expect(screen.queryByText(/choose an applet/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /applet library/i })).not.toBeInTheDocument();
    expect(
      screen.getByText(/explore when first-digit frequencies approach Benford's Law/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open benford emergence lab/i })
    ).toBeInTheDocument();
  });

  it("starts on the catalog instead of inside the Benford applet", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /benford emergence lab/i })).toBeInTheDocument();
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

  it("opens Benford's definition, explainer, simulation, and quiz tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: /open benford emergence lab/i })
    );

    expect(
      screen.getByRole("heading", { name: /what is benford's law/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /why it happens/i }));

    expect(
      screen.getByRole("heading", { name: /why benford happens/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /what is benford's law/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /simulations/i }));

    expect(
      screen.getByRole("heading", { name: /simulations/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/compare additive and multiplicative processes/i)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^quiz$/i }));

    expect(screen.getByRole("heading", { name: /quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel", { name: /quiz/i })).toBeInTheDocument();
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

    // The tablist is a single tab stop; only the active tab is in tab order.
    await user.tab();
    expect(
      screen.getByRole("tab", { name: /^what it is$/i })
    ).toHaveFocus();
    expect(
      screen.getByRole("tab", { name: /^what it is$/i })
    ).toHaveAttribute("aria-selected", "true");

    // Arrow keys move between tabs with roving focus and activate the panel.
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /why it happens/i })).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: /why benford happens/i })
    ).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /simulations/i })).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: /simulations/i })
    ).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /^quiz$/i })).toHaveFocus();
    expect(screen.getByRole("tabpanel", { name: /quiz/i })).toBeInTheDocument();

    // Wraps around from the last tab back to the first.
    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("tab", { name: /^what it is$/i })
    ).toHaveFocus();
  });

  it("keeps quiz results when a review link opens an explanation tab", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /open benford emergence lab/i }));
    await user.click(screen.getByRole("tab", { name: /^quiz$/i }));

    for (let index = 0; index < 8; index += 1) {
      await user.click(screen.getAllByRole("radio")[0]);
      await user.click(screen.getByRole("button", { name: /check answer/i }));
      await user.click(screen.getByRole("button", { name: index === 7 ? /see results/i : /next question/i }));
    }

    expect(screen.getByRole("heading", { name: /quiz complete/i })).toBeInTheDocument();
    await user.click(screen.getAllByRole("link", { name: /review what it is/i })[0]);
    expect(screen.getByRole("heading", { name: /what is benford's law/i })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^quiz$/i }));
    expect(screen.getByRole("heading", { name: /quiz complete/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry missed questions/i })).toBeInTheDocument();

    const wideRangeLink = screen.getAllByRole("link", { name: /review why it happens/i })
      .find((link) => link.getAttribute("href") === "#wide-range-title");
    expect(wideRangeLink).toBeDefined();
    await user.click(wideRangeLink!);
    expect(screen.getByRole("heading", { name: /a wide range alone is not enough/i })).toBeInTheDocument();
  });
});
