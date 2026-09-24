import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { SampleDiagnostics } from "../lib/diagnostics";

import { DiagnosticSummary } from "./DiagnosticSummary";

const sampleDiagnostics: SampleDiagnostics = {
  logWidth: 0.83,
  widthLabel: "transitional",
  benfordRmse: 0.124,
  explanation: "Fractional logs are smoothing toward Benford.",
  digitFrequencies: Array.from({ length: 9 }, () => 1 / 9)
};

describe("DiagnosticSummary", () => {
  it("renders every metric as a label/value pair with consistent structure", () => {
    render(
      <DiagnosticSummary
        diagnostics={sampleDiagnostics}
        sampleSize={10000}
        seed={42}
      />
    );

    const aside = screen.getByRole("complementary", {
      name: /simulation diagnostics/i
    });

    expect(within(aside).getByText("SD(log₁₀ X)")).toBeInTheDocument();
    expect(within(aside).getByText("0.83")).toBeInTheDocument();

    expect(within(aside).getByText("Width class")).toBeInTheDocument();
    expect(within(aside).getByText("transitional")).toBeInTheDocument();

    expect(within(aside).getByText("Distance from Benford")).toBeInTheDocument();
    expect(within(aside).getByText("0.124")).toBeInTheDocument();
    expect(within(aside).getByText(/12\.4 percentage points/i)).toBeInTheDocument();

    expect(within(aside).getByText("Sample size")).toBeInTheDocument();
    expect(within(aside).getByText("10,000")).toBeInTheDocument();
  });

  it("shows the seed alongside the explanation and exposes it via testid", () => {
    render(
      <DiagnosticSummary
        diagnostics={sampleDiagnostics}
        sampleSize={10000}
        seed={42}
      />
    );

    expect(
      screen.getByText(/fractional logs are smoothing toward benford/i)
    ).toBeInTheDocument();
    expect(screen.getByTestId("seed-value")).toHaveTextContent("42");
  });

  it("shows the metric explanations as visible captions, not hover titles", () => {
    render(
      <DiagnosticSummary
        diagnostics={sampleDiagnostics}
        sampleSize={10000}
        seed={42}
      />
    );

    expect(screen.getByText("0.83")).not.toHaveAttribute("title");
    expect(screen.getByText("0.124")).not.toHaveAttribute("title");
    expect(
      screen.getByText(/standard deviation of log₁₀\(x\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/root-mean-square error of observed vs benford/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/typical sampling-only RMSE.*0\.003/i)).toBeInTheDocument();
    expect(screen.getByText(/not a pass\/fail test/i)).toBeInTheDocument();
    expect(screen.getByText(/teaching category based on log spread/i)).toBeInTheDocument();
    expect(screen.getByText(/transitional samples can already match/i)).toBeInTheDocument();
  });
});
