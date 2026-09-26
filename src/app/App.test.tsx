import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("opens directly on Benford Emergence Lab without the catalog shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /benford emergence lab/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /what is benford's law/i })).toBeInTheDocument();
    expect(screen.getByRole("tablist", { name: /benford applet pages/i })).toBeInTheDocument();
    expect(screen.queryByText(/statquest/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /applet catalog/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /open benford|back to applet library/i })).not.toBeInTheDocument();
  });

  it("switches among the definition, explainer, why it happens, and quiz", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: /how it works/i }));
    expect(screen.getByRole("heading", { name: /^how it works$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /why it happens/i }));
    expect(screen.getByRole("heading", { name: /^why it happens$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /when fractional logs become nearly uniform/i })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /^quiz$/i }));
    expect(screen.getByRole("heading", { name: /benford quiz/i })).toBeInTheDocument();
  });

  it("starts keyboard navigation at the first tab and wraps through all four", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.tab();
    expect(screen.getByRole("tab", { name: /^what it is$/i })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /how it works/i })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /why it happens/i })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /^quiz$/i })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /^what it is$/i })).toHaveFocus();
  });

  it("keeps quiz results when a review link opens an explanation tab", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("tab", { name: /^quiz$/i }));

    for (let index = 0; index < 13; index += 1) {
      await user.click(screen.getAllByRole("radio")[0]);
      await user.click(screen.getByRole("button", { name: /check answer/i }));
      await user.click(screen.getByRole("button", { name: index === 12 ? /see results/i : /next question/i }));
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
    expect(screen.getByRole("tab", { name: /why it happens/i })).toHaveAttribute("aria-selected", "true");
  });
});
