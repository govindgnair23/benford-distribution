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
  const binWidth = 0.1;
  const bins = histogram(values, { binCount: 10, min: 0, max: 1 }).map(
    (bin) => ({
      range: `${bin.start.toFixed(1)}–${bin.end.toFixed(1)}`,
      count: bin.count,
      density: values.length === 0 ? 0 : bin.count / (values.length * binWidth)
    })
  );

  return (
    <ChartFrame
      title="3 · Fractional logs"
      summary={`${values.length.toLocaleString()} values across 10 bins. Vertical axis: Density. A uniform density has height 1; flatter fractional logs are more consistent with Benford behavior.`}
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
            width={44}
            stroke={chartPalette.neutrals.axis}
            tick={{ fill: chartPalette.neutrals.label }}
            label={{
              value: "Density",
              angle: -90,
              position: "insideLeft",
              fill: chartPalette.neutrals.label
            }}
          />
          <Tooltip {...chartTooltipStyle} />
          <ReferenceLine
            y={1}
            stroke={chartPalette.neutrals.label}
            strokeDasharray="4 4"
            label={{
              value: "Uniform density = 1",
              position: "insideTopRight",
              fill: chartPalette.neutrals.label,
              fontSize: 11
            }}
          />
          <Bar
            dataKey="density"
            name="Density"
            fill={chartPalette.series[0]}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <ul className="visually-hidden" aria-label="Fractional-log histogram bin counts">
        {bins.map((bin) => (
          <li key={bin.range}>
            {bin.range}: {bin.count} value{bin.count === 1 ? "" : "s"}; density{" "}
            {bin.density.toFixed(2)}
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
