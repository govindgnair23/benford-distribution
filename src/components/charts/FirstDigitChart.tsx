import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { benfordProbability } from "../../lib/benford";
import { firstDigitFrequencies } from "../../lib/diagnostics";
import { editorialColors } from "../../styles/tokens";
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
      title="First digits vs Benford"
      summary="Observed first-digit frequencies are shown next to Benford reference probabilities."
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={rows} margin={{ top: 10, right: 10, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="digit" tick={{ fontSize: 12 }} />
          <YAxis unit="%" width={44} />
          <Tooltip />
          <Legend />
          <Bar dataKey="observed" fill={editorialColors.accentDeep} radius={[3, 3, 0, 0]} />
          <Bar dataKey="benford" fill={editorialColors.accentGold} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <ul className="sr-summary" aria-label="First digit frequency summary">
        {rows.map((row) => (
          <li key={row.digit}>
            {row.digit} observed {row.observed.toFixed(1)}%, Benford{" "}
            {row.benford.toFixed(1)}%
          </li>
        ))}
      </ul>
    </ChartFrame>
  );
}
