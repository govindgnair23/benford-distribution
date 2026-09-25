import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { benfordProbability } from "../../lib/benford";
import { firstDigitFrequencies } from "../../lib/diagnostics";
import { chartPalette, chartTooltipStyle, editorialColors } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

interface FirstDigitChartProps {
  firstDigits: number[];
}

export function FirstDigitChart({ firstDigits }: FirstDigitChartProps) {
  const observed = firstDigitFrequencies(firstDigits);
  const rows = observed.map((frequency, index) => {
    const digit = index + 1;
    return {
      digit: `D=${digit}`,
      observed: Number((frequency * 100).toFixed(1)),
      benford: Number((benfordProbability(digit) * 100).toFixed(1))
    };
  });

  return (
    <ChartFrame
      title="4 · First digits vs Benford"
      summary="Share of values (%). Sample frequencies—vary between runs—are bars; the Benford reference is the connected line."
    >
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={rows} margin={{ top: 10, right: 10, bottom: 4, left: 0 }}>
          <CartesianGrid
            stroke={chartPalette.neutrals.gridline}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="digit"
            stroke={chartPalette.neutrals.axis}
            tick={{ fill: chartPalette.neutrals.label, fontSize: 12 }}
          />
          <YAxis
            unit="%"
            width={44}
            stroke={chartPalette.neutrals.axis}
            tick={{ fill: chartPalette.neutrals.label }}
            label={{
              value: "Share of values (%)",
              angle: -90,
              position: "insideLeft",
              fill: chartPalette.neutrals.label
            }}
          />
          <Tooltip {...chartTooltipStyle} />
          <Legend />
          <Bar
            dataKey="observed"
            name="Sample frequency"
            fill={chartPalette.series[0]}
            radius={[3, 3, 0, 0]}
          />
          <Line
            dataKey="benford"
            name="Benford reference"
            type="monotone"
            stroke={editorialColors.accentWarm}
            strokeWidth={2}
            dot={{ r: 3, fill: editorialColors.accentWarm }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <ul className="sr-summary" aria-label="First digit frequency summary">
        {rows.map((row) => (
          <li key={row.digit}>
            {row.digit} observed {row.observed.toFixed(1)}%, Benford reference{" "}
            {row.benford.toFixed(1)}%
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
