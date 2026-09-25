import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExplainerPage } from "./ExplainerPage";

describe("ExplainerPage", () => {
  it("shows a worked example and digit intervals before the optional derivation", async () => {
    const user = userEvent.setup();
    render(<ExplainerPage />);
    const example = screen.getByLabelText("Worked example from 3140 to first digit 3");
    const strip = screen.getByRole("img", { name: /first digit intervals/i });
    const toggle = screen.getByText("Show the derivation");
    const details = toggle.closest("details")!;
    expect(details).not.toHaveAttribute("open");
    expect(example.compareDocumentPosition(strip) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(strip.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await user.click(toggle);
    expect(details).toHaveAttribute("open");
    expect(within(details).getByLabelText(/benford digit interval probability formula/i)).toBeInTheDocument();
    expect(within(details).getByLabelText(/fractional part definition/i)).toBeInTheDocument();
  });

  it("uses d for the digit and keeps K for the scale exponent", () => {
    render(<ExplainerPage />);
    expect(screen.getByText(/first digit D is d/i)).toBeInTheDocument();
    expect(screen.getByText(/scale exponent \(K\).*significand \(M\)/i)).toBeInTheDocument();
    expect(screen.queryByText(/first digit D is k/i)).not.toBeInTheDocument();
  });

  it("distinguishes ten illustration points from uniformity over the full interval", () => {
    render(<ExplainerPage />);
    expect(screen.getByText(/ten fractional positions.*entire interval/i)).toBeInTheDocument();
    expect(screen.queryByText(/If the ten totals are equal/i)).not.toBeInTheDocument();
    expect(screen.getByText(/powers of 10.*first digit 1/i)).toBeInTheDocument();
  });

  it("keeps density math optional and preserves the negative-log example", async () => {
    const user = userEvent.setup();
    render(<ExplainerPage />);
    const toggle = screen.getByText("See the math and density comparison");
    expect(toggle.closest("details")).not.toHaveAttribute("open");
    await user.click(toggle);
    expect(toggle.closest("details")).toHaveAttribute("open");
    expect(screen.getByLabelText("Wrapped density formula")).toBeInTheDocument();
    expect(screen.getByText(/fractional part of -2.8 is -2.8 - \(-3\) = 0.2/i)).toBeInTheDocument();
    expect(screen.getByText(/Normality is not required/i)).toBeInTheDocument();
  });
});
