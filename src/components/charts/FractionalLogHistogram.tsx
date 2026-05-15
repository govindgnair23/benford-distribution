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

interface FractionalLogHistogramProps {
  values: number[];
}

export function FractionalLogHistogram({ values }: FractionalLogHistogramProps) {
  const bins = histogram(values, { binCount: 10, min: 0, max: 1 }).map((bin) => ({
    range: `${bin.start.toFixed(1)}-${bin.end.toFixed(1)}`,
    count: bin.count
  }));

  return (
    <ChartFrame
      title="Fractional-log histogram"
      summary={`${values.length.toLocaleString()} values across 10 bins. Fractional logs are the direct diagnostic for Benford behavior.`}
    >
      <div
        className="chart-summary sr-summary"
        aria-label="Fractional logs are the direct diagnostic for whether first digits should look Benford-like."
      >
        {values.length} values across 10 bins
      </div>
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
          <Tooltip />
          <Bar dataKey="count" fill={editorialColors.accentWarm} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
