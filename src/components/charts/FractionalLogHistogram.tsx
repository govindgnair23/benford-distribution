import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { histogram } from "../../lib/histograms";
import { chartPalette, chartTooltipStyle } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

interface FractionalLogHistogramProps {
  values: number[];
}

export function FractionalLogHistogram({ values }: FractionalLogHistogramProps) {
  const bins = histogram(values, { binCount: 10, min: 0, max: 1 }).map((bin) => ({
    range: `${bin.start.toFixed(1)}-${bin.end.toFixed(1)}`,
    count: bin.count
  }));
  const expectedCount = values.length / 10;

  return (
    <ChartFrame
      title="3 · Fractional logs"
      summary={`${values.length.toLocaleString()} values across 10 bins. The dashed line marks the expected count if fractional logs were perfectly uniform (N ÷ 10). Fractional logs are the direct diagnostic for Benford behavior.`}
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 4, left: 0 }}>
          <CartesianGrid
            stroke={chartPalette.neutrals.gridline}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="range"
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
          <ReferenceLine
            y={expectedCount}
            stroke={chartPalette.neutrals.label}
            strokeDasharray="4 4"
            label={{
              value: "Uniform N ÷ 10",
              position: "insideTopRight",
              fill: chartPalette.neutrals.label,
              fontSize: 11
            }}
          />
          <Bar dataKey="count" fill={chartPalette.series[0]} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="visually-hidden" aria-label="Fractional-log histogram bin counts">
        {bins.map((bin) => (
          <li key={bin.range}>
            {bin.range}: {bin.count} value{bin.count === 1 ? "" : "s"}
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
