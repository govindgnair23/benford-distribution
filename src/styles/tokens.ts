// Mirrors the chart subset of `:root` in src/styles/global.css. Keep in sync.
// CSS variables remain the visual source of truth for stylesheet rules;
// this module exposes typed string constants for Recharts components, which
// consume colors as JS string props.

export const chartPalette = {
  // Okabe-Ito ordered series — distinguishable under deuteranopia, protanopia,
  // and tritanopia. See https://jfly.uni-koeln.de/color/ and the design system doc.
  series: ["#0072b2", "#d55e00", "#009e73", "#cc79a7"] as const,

  regionFill: {
    cool: "rgba(31, 56, 50, 0.14)",
    warm: "rgba(210, 75, 42, 0.14)",
  },

  diverging: {
    positive: "#0072b2",
    negative: "#d55e00",
  },

  neutrals: {
    axis: "#65716c",
    gridline: "#d9cdb8",
    label: "#65716c",
  },
} as const;

export type ChartSeriesIndex = 0 | 1 | 2 | 3;

// Editorial accents and muted greys used inside charts as semantic markers
// (e.g. the canonical Benford reference, the warm "diagnostic" emphasis,
// or a soft reference line). Values mirror the matching --accent-* and
// muted-neutral tokens; consume these from TSX where CSS variables are
// unavailable.
export const editorialColors = {
  accentWarm: "#d24b2a",
  accentWarmDeep: "#8d3d25",
  accentDeep: "#1f3832",
} as const;

// Shared Recharts <Tooltip> styling so every chart renders the same editorial
// tooltip: cream --surface-card background, 1px --border-card hairline, no
// radius, no shadow, --ink-strong text. Spread onto <Tooltip {...chartTooltipStyle} />.
export const chartTooltipStyle = {
  contentStyle: {
    background: "#fffaf1",
    border: "1px solid #d9cdb8",
    borderRadius: 0,
    boxShadow: "none",
    color: "#18211f",
  },
  wrapperStyle: { outline: "none" },
  labelStyle: { color: "#18211f", fontWeight: 700 },
  itemStyle: { color: "#18211f" },
} as const;
