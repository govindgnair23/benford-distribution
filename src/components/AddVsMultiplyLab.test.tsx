import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AddVsMultiplyLab } from "./AddVsMultiplyLab";

const adding = () => screen.getByRole("region", { name: /adding newcomers/i });
const percentage = () => screen.getByRole("region", { name: /percentage growth/i });

describe("AddVsMultiplyLab", () => {
  it("poses the exercise and shows one first-digit chart per kind of growth", () => {
    render(<AddVsMultiplyLab />);

    expect(
      screen.getByRole("heading", { name: /exercise: which kind of town growth spreads populations across many orders of magnitude/i })
    ).toBeInTheDocument();
    expect(within(adding()).getByRole("img", { name: /first digits.*benford/i })).toBeInTheDocument();
    expect(within(percentage()).getByRole("img", { name: /first digits.*benford/i })).toBeInTheDocument();
  });

  it("has no sliders or diagnostics, only duration presets", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.queryAllByRole("slider")).toHaveLength(0);
    expect(screen.queryByText(/rmse/i)).not.toBeInTheDocument();
    const presets = screen.getByRole("group", { name: /decades of growth/i });
    expect(within(presets).getAllByRole("button").map((button) => button.textContent)).toEqual([
      "1 decade",
      "10 decades",
      "50 decades",
      "200 decades"
    ]);
    expect(within(presets).getByRole("button", { name: "200 decades" })).toHaveAttribute("aria-pressed", "true");
  });

  it("after 200 decades, only percentage growth is close to Benford", () => {
    render(<AddVsMultiplyLab />);

    expect(within(adding()).getByText("Not Benford")).toBeInTheDocument();
    expect(within(percentage()).getByText("Close to Benford")).toBeInTheDocument();
  });

  it("after 1 decade, neither kind of growth is Benford", () => {
    render(<AddVsMultiplyLab />);

    fireEvent.click(screen.getByRole("button", { name: "1 decade" }));
    expect(screen.getByRole("button", { name: "1 decade" })).toHaveAttribute("aria-pressed", "true");
    expect(within(adding()).getByText("Not Benford")).toBeInTheDocument();
    expect(within(percentage()).getByText("Not Benford")).toBeInTheDocument();
  });

  it("states each population range under its chart", () => {
    render(<AddVsMultiplyLab />);

    expect(within(adding()).getByText(/towns range from about [\d,.]+ to [\d,.]+/i)).toBeInTheDocument();
    expect(within(percentage()).getByText(/towns range from about/i)).toBeInTheDocument();
  });

  it("states the takeaway", () => {
    render(<AddVsMultiplyLab />);

    expect(screen.getByTestId("growth-takeaway")).toHaveTextContent("After 200 decades");
    expect(screen.getByTestId("growth-takeaway")).toHaveTextContent("close to Benford");
    fireEvent.click(screen.getByRole("button", { name: "1 decade" }));
    expect(screen.getByTestId("growth-takeaway")).toHaveTextContent("After 1 decade");
    expect(screen.getByTestId("growth-takeaway")).toHaveTextContent("still far from Benford");
  });
});
