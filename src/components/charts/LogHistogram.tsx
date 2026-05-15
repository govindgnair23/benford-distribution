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
import { editorialColors } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

interface LogHistogramProps {
  values: number[];
}

export function LogHistogram({ values }: LogHistogramProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = min === max ? 0.5 : 0;
  const bins = histogram(values, {
    binCount: 16,
    min: min - padding,
    max: max + padding
  }).map((bin) => ({
    label: ((bin.start + bin.end) / 2).toFixed(1),
    range: `${bin.start.toFixed(1)}-${bin.end.toFixed(1)}`,
    count: bin.count
  }));

  return (
    <ChartFrame
      title="Histogram of log10(X)"
      summary="This shows how wide the distribution is before wrapping fractional parts."
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={bins} margin={{ top: 10, right: 10, bottom: 22, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            interval={3}
            minTickGap={10}
            tick={{ fontSize: 11 }}
          />
          <YAxis allowDecimals={false} width={44} />
          <Tooltip />
          <Bar dataKey="count" fill={editorialColors.mutedBar} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
