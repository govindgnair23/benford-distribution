import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { histogram } from "../../lib/histograms";
import { chartPalette, chartTooltipStyle } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

interface OriginalValueHistogramProps {
  values: number[];
}

export function OriginalValueHistogram({ values }: OriginalValueHistogramProps) {
  const finiteValues = values.filter(Number.isFinite);
  const min = Math.min(...finiteValues);
  const max = Math.max(...finiteValues);
  const padding = min === max ? Math.max(1, Math.abs(min) * 0.05) : 0;
  const bins = histogram(finiteValues, {
    binCount: 16,
    min: min - padding,
    max: max + padding
  }).map((bin) => ({
    label: formatValue((bin.start + bin.end) / 2),
    range: `${formatValue(bin.start)}-${formatValue(bin.end)}`,
    count: bin.count
  }));

  return (
    <ChartFrame
      title="1 · Original values"
      summary="This is the original-value distribution before taking logs."
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 22, left: 0 }}>
          <CartesianGrid
            stroke={chartPalette.neutrals.gridline}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            interval={3}
            minTickGap={10}
            stroke={chartPalette.neutrals.axis}
            tick={{ fill: chartPalette.neutrals.label, fontSize: 11 }}
          />
          <YAxis
            allowDecimals={false}
            width={44}
            stroke={chartPalette.neutrals.axis}
            tick={{ fill: chartPalette.neutrals.label }}
          />
          <Tooltip {...chartTooltipStyle} />
          <Bar dataKey="count" fill={chartPalette.series[0]} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="visually-hidden" aria-label="Original-value histogram bin counts">
        {bins.map((bin) => (
          <li key={bin.range}>
            {bin.range}: {bin.count} value{bin.count === 1 ? "" : "s"}
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}

function formatValue(value: number) {
  if (Math.abs(value) >= 100000 || Math.abs(value) < 0.01) {
    return value.toExponential(1);
  }
  return value.toFixed(1);
}
