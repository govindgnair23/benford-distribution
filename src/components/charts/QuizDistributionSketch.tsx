import { chartPalette } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

export type DistributionSketch = {
  scale: "X" | "log₁₀(X)";
  shape: "decreasing" | "bell-shaped" | "right-skewed" | "two-peaked";
};

// Illustrative silhouettes, deliberately not specified probability models.
const outlines = {
  decreasing: "M 50 35 C 85 80, 120 135, 210 159 S 420 184, 500 188",
  "bell-shaped": "M 50 195 C 130 195, 155 185, 190 120 S 240 32, 275 32 S 325 55, 360 120 S 420 195, 500 195",
  "right-skewed": "M 50 195 C 65 195, 85 35, 130 35 S 200 110, 260 145 S 405 188, 500 195",
  "two-peaked": "M 50 195 C 85 195, 95 45, 145 45 S 190 180, 260 180 S 330 65, 380 65 S 445 195, 500 195"
};

export function QuizDistributionSketch({ scale, shape }: DistributionSketch) {
  return (
    <ChartFrame title={`Distribution on ${scale}`} summary="Schematic shape, not an exact density. The horizontal axis spans 1 to 10; no fractional-log distribution is shown.">
      <svg className="quiz-distribution-sketch" viewBox="0 0 550 265" role="img" aria-label={`${shape} distribution sketch on ${scale}, from 1 to 10`}>
        <path d={`${outlines[shape]} L 500 200 L 50 200 Z`} fill={chartPalette.regionFill.cool} />
        <path d={outlines[shape]} fill="none" stroke={chartPalette.series[0]} strokeWidth="3" />
        <path d="M 50 25 V 200 H 500" fill="none" stroke={chartPalette.neutrals.axis} />
        <text x="50" y="18" fill={chartPalette.neutrals.label}>Relative density (schematic)</text>
        {[1, 4, 7, 10].map((tick) => <g key={tick}>
          <path d={`M ${50 + (tick - 1) * 50} 200 v 6`} stroke={chartPalette.neutrals.axis} />
          <text x={50 + (tick - 1) * 50} y="225" textAnchor="middle" fill={chartPalette.neutrals.label}>{tick}</text>
        </g>)}
        <text x="275" y="252" textAnchor="middle" fill={chartPalette.neutrals.label}>{scale === "X" ? "X — original values" : "log₁₀(X) — base-10 logarithms"}</text>
      </svg>
    </ChartFrame>
  );
}
