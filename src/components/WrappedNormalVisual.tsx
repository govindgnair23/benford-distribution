import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  normalDensity,
  shiftedDensityContributions,
  wrappedDensityProfile,
  wrappedDensitySum
} from "../lib/wrappedNormal";
import { chartPalette, editorialColors } from "../styles/tokens";

interface NormalCase {
  key: string;
  title: string;
  formula: string;
  mean: number;
  standardDeviation: number;
  xMin: number;
  xMax: number;
  minShift: number;
  maxShift: number;
  summary: string;
  pointSummary: string;
}

// R=0.2 uses series[2] (bluish green) and R=0.7 uses series[0] (blue) so the
// legend reads canonical-Okabe-Ito; CSS swatches in .legend-swatch.point-two
// and .legend-swatch.point-seven mirror this assignment.
const residues = [
  { value: 0.2, label: "R = 0.2", color: chartPalette.series[2] },
  { value: 0.7, label: "R = 0.7", color: chartPalette.series[0] }
];

const cases: NormalCase[] = [
  {
    key: "narrow",
    title: "Narrow Normal",
    formula: "Normal(3.2, 0.1^2)",
    mean: 3.2,
    standardDeviation: 0.1,
    xMin: 2.1,
    xMax: 4.8,
    minShift: 2,
    maxShift: 4,
    summary: "The narrow sums are very different because R = 0.2 lands near the peak.",
    pointSummary: "R = 0.2 uses 2.2, 3.2, 4.2. R = 0.7 uses 2.7, 3.7, 4.7."
  },
  {
    key: "wide",
    title: "Wide Normal",
    formula: "Normal(3.2, 10^2)",
    mean: 3.2,
    standardDeviation: 10,
    xMin: -27,
    xMax: 34,
    minShift: -27,
    maxShift: 29,
    summary: "The wide sums are much closer because the curve changes slowly over one unit.",
    pointSummary:
      "R = 0.2 runs from -26.8 through 29.2. R = 0.7 runs from -26.3 through 29.7."
  }
];

function densityRows({ mean, standardDeviation, xMin, xMax }: NormalCase) {
  const steps = 80;
  const width = xMax - xMin;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const x = xMin + (width * index) / steps;
    return {
      x: Number(x.toFixed(2)),
      density: Number(normalDensity(x, mean, standardDeviation).toFixed(5))
    };
  });
}

function contributionLines(normalCase: NormalCase) {
  return residues.flatMap((residue) =>
    shiftedDensityContributions({
      mean: normalCase.mean,
      standardDeviation: normalCase.standardDeviation,
      residue: residue.value,
      minShift: normalCase.minShift,
      maxShift: normalCase.maxShift
    }).map((point) => ({
      ...point,
      residue: residue.value,
      color: residue.color
    }))
  );
}

function summedDensity(normalCase: NormalCase, residue: number) {
  return wrappedDensitySum({
    mean: normalCase.mean,
    standardDeviation: normalCase.standardDeviation,
    residue,
    minShift: normalCase.minShift,
    maxShift: normalCase.maxShift
  });
}

function profileRows(normalCase: NormalCase) {
  return wrappedDensityProfile({
    mean: normalCase.mean,
    standardDeviation: normalCase.standardDeviation,
    minShift: normalCase.minShift,
    maxShift: normalCase.maxShift,
    step: 0.1
  }).map((point) => ({
    residue: point.residue,
    density: Number(point.density.toFixed(5))
  }));
}

export function WrappedNormalVisual() {
  return (
    <section
      className="wrap-visual"
      aria-label="Narrow and wide normal wrapping comparison"
    >
      <div className="wrap-visual-header">
        <p className="eyebrow">Deeper look</p>
        <h4>Integer-shift density contributions</h4>
        <p>
          Compare R = 0.2 and R = 0.7 by adding Normal-density values at every
          integer shift k + R. Green lines mark R = 0.2, and blue lines mark R =
          0.7 in the finite plotted window.
        </p>
        <div className="wrap-density-legend" aria-label="Contribution line colors">
          <span>
            <i className="legend-swatch point-two" /> Green lines mark R = 0.2
          </span>
          <span>
            <i className="legend-swatch point-seven" /> Blue lines mark R = 0.7
          </span>
        </div>
      </div>

      <div className="wrap-density-grid">
        {cases.map((normalCase) => {
          const rows = densityRows(normalCase);
          const profile = profileRows(normalCase);
          const lines = contributionLines(normalCase);
          const atPointTwo = summedDensity(normalCase, 0.2);
          const atPointSeven = summedDensity(normalCase, 0.7);
          const profileSummary =
            normalCase.key === "narrow"
              ? "Narrow profile peaks near R = 0.2 instead of staying flat."
              : "Wide profile is much flatter, so fractional positions have similar wrapped density.";

          return (
            <article className="wrap-density-panel" key={normalCase.key}>
              <div className="wrap-density-heading">
                <h5>{normalCase.title}</h5>
                <p>{normalCase.formula}</p>
              </div>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart
                  data={rows}
                  margin={{ top: 8, right: 10, bottom: 6, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[normalCase.xMin, normalCase.xMax]}
                    interval="preserveStartEnd"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis hide domain={[0, "dataMax"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="density"
                    dot={false}
                    stroke={editorialColors.accentDeep}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  {lines.map((line) => (
                    <ReferenceLine
                      key={`${normalCase.key}-${line.residue}-${line.x}`}
                      x={line.x}
                      stroke={line.color}
                      strokeOpacity={0.62}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="wrap-density-summary">{normalCase.summary}</p>
              <p className="wrap-density-points">{normalCase.pointSummary}</p>
              <dl className="wrap-density-values">
                <div>
                  <dt>R = 0.2 sum</dt>
                  <dd>{atPointTwo.toFixed(3)}</dd>
                </div>
                <div>
                  <dt>R = 0.7 sum</dt>
                  <dd>{atPointSeven.toFixed(3)}</dd>
                </div>
              </dl>
              <div className="wrapped-profile-block">
                <h6>Wrapped density across fractional positions</h6>
                <p>Calculated at R = 0, 0.1, 0.2, ..., 1.</p>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart
                    data={profile}
                    margin={{ top: 8, right: 10, bottom: 6, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      type="number"
                      dataKey="residue"
                      domain={[0, 1]}
                      ticks={[0, 0.2, 0.4, 0.6, 0.8, 1]}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis hide domain={[0, "dataMax"]} />
                    <Tooltip />
                    <ReferenceLine
                      y={1}
                      stroke={editorialColors.inkSubtle}
                      strokeDasharray="4 4"
                    />
                    <Line
                      type="monotone"
                      dataKey="density"
                      dot
                      stroke={editorialColors.accentWarmDeep}
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="wrapped-profile-summary">{profileSummary}</p>
              </div>
            </article>
          );
        })}
      </div>

      <ul
        className="sr-summary"
        aria-label="Integer-shift contribution summary"
      >
        <li>
          Narrow Normal uses green integer-shift contribution lines for R = 0.2
          at 2.2, 3.2, 4.2 and blue lines for R = 0.7 at 2.7, 3.7, 4.7; the
          narrow sums are very different.
        </li>
        <li>
          Wide Normal uses green integer-shift contribution lines for R = 0.2
          from -26.8 through 29.2 and blue lines for R = 0.7 from -26.3 through
          29.7; the wide sums are much closer.
        </li>
      </ul>
    </section>
  );
}
