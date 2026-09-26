import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ExplainerPage } from "./ExplainerPage";

describe("ExplainerPage", () => {
  it("shows a worked example and digit intervals before the optional derivation", async () => {
    const user = userEvent.setup();
    render(<ExplainerPage />);
    const example = screen.getByTestId("mapping-stage");
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

  it("leaves the multiplicative mechanism to the Why it happens tab", () => {
    render(<ExplainerPage />);
    expect(screen.queryByRole("heading", { name: /how multiplicative processes can produce it/i })).not.toBeInTheDocument();
    expect(screen.queryByText("See the math and density comparison")).not.toBeInTheDocument();
  });
});
