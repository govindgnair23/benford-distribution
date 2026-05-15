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
import { chartPalette, editorialColors } from "../../styles/tokens";
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
      title="Histogram of X"
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
          <Tooltip />
          <Bar dataKey="count" fill={editorialColors.accentWarmDeep} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

function formatValue(value: number) {
  if (Math.abs(value) >= 100000 || Math.abs(value) < 0.01) {
    return value.toExponential(1);
  }
  return value.toFixed(1);
}
