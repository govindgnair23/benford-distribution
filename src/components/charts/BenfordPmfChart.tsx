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
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="digit" tick={{ fontSize: 12 }} />
          <YAxis unit="%" width={44} />
          <Tooltip />
          <Bar dataKey="probability" fill="#1f3832" radius={[3, 3, 0, 0]} />
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
