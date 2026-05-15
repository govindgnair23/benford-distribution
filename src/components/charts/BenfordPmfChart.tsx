import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { benfordProbability } from "../../lib/benford";
import { chartPalette, editorialColors } from "../../styles/tokens";
import { ChartFrame } from "./ChartFrame";

export function BenfordPmfChart() {
  const rows = Array.from({ length: 9 }, (_, index) => {
    const digit = index + 1;
    return {
      digit: `D=${digit}`,
      probability: Number((benfordProbability(digit) * 100).toFixed(1))
    };
  });

  return (
    <ChartFrame
      title="Benford PMF"
      summary="Benford probabilities decrease from about 30.1% for digit 1 to about 4.6% for digit 9."
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={rows} margin={{ top: 10, right: 10, bottom: 4, left: 0 }}>
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
          />
          <Tooltip />
          <Bar dataKey="probability" fill={editorialColors.accentDeep} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul
        className="sr-summary"
        aria-label="Benford probability mass function for first digits"
      >
        {rows.map((row) => (
          <li key={row.digit}>
            {row.digit} probability {row.probability.toFixed(1)}%
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
