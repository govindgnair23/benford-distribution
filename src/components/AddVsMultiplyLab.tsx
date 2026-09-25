import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import {
  benfordVerdict,
  defaultAddVsMultiplyConfig,
  simulateAddVsMultiply,
  type BenfordVerdict,
  type ProcessRun,
  type ProcessStep
} from "../lib/addVsMultiply";
import { benfordProbability } from "../lib/benford";
import { expectedBenfordSamplingRmse } from "../lib/diagnostics";
import { useElementWidth } from "./useElementWidth";

const STEPS_PER_SECOND = 30;
const SAMPLE_SIZE = defaultAddVsMultiplyConfig.sampleSize;
const TOTAL_STEPS = defaultAddVsMultiplyConfig.steps;

type ProcessKey = "add" | "multiply";

const verdictText: Record<BenfordVerdict, string> = {
  close: "Close to Benford",
  closer: "Getting closer",
  far: "Not Benford"
};

function prefersReducedMotion() {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatLogValue(logValue: number) {
  const value = 10 ** logValue;
  if (value >= 1e6 || value < 0.01) return `10^${logValue.toFixed(1)}`;
  return Number(value.toPrecision(2)).toLocaleString("en-US");
}

function formatOrders(orders: number) {
  return orders < 1 ? orders.toFixed(2) : orders.toFixed(1);
}

function logTicks(low: number, high: number) {
  const span = high - low;
  const multipliers = span > 3 ? [1] : span > 1.2 ? [1, 3] : [1, 2, 5];
  const ticks: number[] = [];
  for (let power = Math.floor(low) - 1; power <= Math.ceil(high); power += 1) {
    for (const multiplier of multipliers) {
      const tick = power + Math.log10(multiplier);
      if (tick >= low && tick <= high) ticks.push(tick);
    }
  }
  if (ticks.length < 2) {
    for (let index = 0; index <= 3; index += 1) ticks.push(low + (index * span) / 3);
  }
  const every = Math.ceil(ticks.length / 7);
  return ticks.filter((_, index) => index % every === 0);
}

function PathsChart({ run, step, name }: { run: ProcessRun; step: number; name: string }) {
  const [ref, width] = useElementWidth(480);
  const height = 190;
  const left = 54;
  const right = 12;
  const top = 10;
  const bottom = 26;
  const plotWidth = Math.max(160, width - left - right);
  const plotHeight = height - top - bottom;
  let { min, max } = run.logRange;
  if (max - min < 0.5) {
    const center = (max + min) / 2;
    min = center - 0.25;
    max = center + 0.25;
  }
  const pad = (max - min) * 0.06;
  min -= pad;
  max += pad;
  const x = (t: number) => left + (t / TOTAL_STEPS) * plotWidth;
  const y = (logValue: number) => top + (1 - (logValue - min) / (max - min)) * plotHeight;

  const visible = run.steps.slice(0, step + 1);
  const upper = visible.map((summary, t) => `${x(t).toFixed(1)},${y(summary.upperLog).toFixed(1)}`);
  const lower = visible.map((summary, t) => `${x(t).toFixed(1)},${y(summary.lowerLog).toFixed(1)}`).reverse();
  const current = run.steps[step];

  return (
    <div className="avm-chart" ref={ref}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        height={height}
        role="img"
        aria-label={`${name}: 95% of values between ${formatLogValue(current.lowerLog)} and ${formatLogValue(current.upperLog)} at step ${step}`}
      >
        {logTicks(min, max).map((tick) => (
          <g key={tick}>
            <line className="avm-grid" x1={left} x2={left + plotWidth} y1={y(tick)} y2={y(tick)} />
            <text className="avm-tick" x={left - 6} y={y(tick) + 4} textAnchor="end">
              {formatLogValue(tick)}
            </text>
          </g>
        ))}
        {[0, 50, 100, 150, 200].map((t) => (
          <text key={t} className="avm-tick" x={x(t)} y={height - 8} textAnchor="middle">{t}</text>
        ))}
        {step > 0 && <polygon className="avm-band" points={`${upper.join(" ")} ${lower.join(" ")}`} />}
        {run.paths.map((path, index) => (
          <polyline
            key={index}
            className="avm-path"
            points={path.slice(0, step + 1).map((value, t) => `${x(t).toFixed(1)},${y(value).toFixed(1)}`).join(" ")}
          />
        ))}
        <line className="avm-now" x1={x(step)} x2={x(step)} y1={top} y2={top + plotHeight} />
      </svg>
    </div>
  );
}

function FractionalChart({ summary, name }: { summary: ProcessStep; name: string }) {
  const [ref, width] = useElementWidth(480);
  const height = 110;
  const left = 30;
  const right = 10;
  const top = 12;
  const bottom = 20;
  const plotWidth = Math.max(160, width - left - right);
  const plotHeight = height - top - bottom;
  const peak = Math.max(2, ...summary.fractionalDensity);
  const yMax = Math.min(peak * 1.05, 20);
  const y = (density: number) => top + (1 - Math.min(density, yMax) / yMax) * plotHeight;
  const binWidth = plotWidth / summary.fractionalDensity.length;

  return (
    <div className="avm-chart" ref={ref}>
      <svg viewBox={`0 0 ${width} ${height}`} height={height} role="img" aria-label={`${name} fractional-log histogram`}>
        {summary.fractionalDensity.map((density, index) => (
          <rect
            key={index}
            className="avm-bin"
            x={left + index * binWidth + 1}
            y={y(density)}
            width={Math.max(1, binWidth - 2)}
            height={top + plotHeight - y(density)}
          />
        ))}
        <line className="avm-uniform" x1={left} x2={left + plotWidth} y1={y(1)} y2={y(1)} />
        <text className="avm-uniform-label" x={left + plotWidth - 2} y={y(1) - 4} textAnchor="end">uniform = 1</text>
        <line className="avm-axis" x1={left} x2={left + plotWidth} y1={top + plotHeight} y2={top + plotHeight} />
        <text className="avm-tick" x={left - 5} y={top + 8} textAnchor="end">
          {yMax < 10 ? yMax.toFixed(1) : Math.round(yMax)}
        </text>
        <text className="avm-tick" x={left - 5} y={top + plotHeight} textAnchor="end">0</text>
        <text className="avm-tick" x={left} y={height - 5}>0</text>
        <text className="avm-tick" x={left + plotWidth} y={height - 5} textAnchor="end">1</text>
      </svg>
    </div>
  );
}

function DigitBars({ summary, name }: { summary: ProcessStep; name: string }) {
  const shares = summary.firstDigitShares;
  const scaleTop = Math.max(0.35, ...shares) * 1.08;
  return (
    <div
      className="avm-digits"
      role="img"
      aria-label={`${name} first digits: ${shares
        .map((share, index) => `${index + 1}: ${(share * 100).toFixed(1)}% vs Benford ${(benfordProbability(index + 1) * 100).toFixed(1)}%`)
        .join("; ")}`}
    >
      {shares.map((share, index) => (
        <div className="avm-digit" key={index} aria-hidden="true">
          <span className="avm-digit-value">{(share * 100).toFixed(1)}</span>
          <div className="avm-digit-column">
            <div className="avm-digit-bar" style={{ height: `${(share / scaleTop) * 100}%` }} />
            <div className="avm-digit-benford" style={{ bottom: `${(benfordProbability(index + 1) / scaleTop) * 100}%` }} />
          </div>
          <span className="avm-digit-label">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function GapChart({ add, multiply, step }: { add: ProcessRun; multiply: ProcessRun; step: number }) {
  const [ref, width] = useElementWidth(960);
  const height = 200;
  const left = 44;
  const right = 14;
  const top = 12;
  const bottom = 28;
  const plotWidth = Math.max(200, width - left - right);
  const plotHeight = height - top - bottom;
  const noiseBand = 2 * expectedBenfordSamplingRmse(SAMPLE_SIZE) * 100;
  const maxGap = Math.max(...add.steps.map((s) => s.benfordRmse), ...multiply.steps.map((s) => s.benfordRmse)) * 100 * 1.05;
  const x = (t: number) => left + (t / TOTAL_STEPS) * plotWidth;
  const y = (gap: number) => top + (1 - gap / maxGap) * plotHeight;
  const tickStep = maxGap > 12 ? 5 : maxGap > 5 ? 2 : 1;
  const ticks: number[] = [];
  for (let value = 0; value <= maxGap; value += tickStep) ticks.push(value);
  const series: Array<[ProcessKey, ProcessRun, string]> = [
    ["add", add, "Add"],
    ["multiply", multiply, "Multiply"]
  ];

  return (
    <div className="avm-chart" ref={ref}>
      <svg viewBox={`0 0 ${width} ${height}`} height={height} role="img" aria-label={`Gap to Benford by step: add ${(add.steps[step].benfordRmse * 100).toFixed(1)}, multiply ${(multiply.steps[step].benfordRmse * 100).toFixed(1)} percentage points at step ${step}`}>
        {ticks.map((value) => (
          <g key={value}>
            <line className="avm-grid" x1={left} x2={left + plotWidth} y1={y(value)} y2={y(value)} />
            <text className="avm-tick" x={left - 6} y={y(value) + 4} textAnchor="end">{value}</text>
          </g>
        ))}
        <rect className="avm-noise" x={left} y={y(noiseBand)} width={plotWidth} height={y(0) - y(noiseBand)} />
        <text className="avm-tick" x={left + plotWidth - 4} y={y(noiseBand) - 4} textAnchor="end">sampling noise</text>
        {[0, 50, 100, 150, 200].map((t) => (
          <text key={t} className="avm-tick" x={x(t)} y={height - 8} textAnchor="middle">{t}</text>
        ))}
        {series.map(([key, run, label]) => {
          const gapNow = run.steps[step].benfordRmse * 100;
          return (
            <g key={key} className={`avm-${key}`}>
              <polyline
                className="avm-gap-line"
                points={run.steps.map((s, t) => `${x(t).toFixed(1)},${y(s.benfordRmse * 100).toFixed(1)}`).join(" ")}
              />
              <circle className="avm-gap-dot" cx={x(step)} cy={y(gapNow)} r={4.5} />
              <text className="avm-gap-label" x={Math.min(x(step) + 8, left + plotWidth - 80)} y={y(gapNow) - 7}>
                {label} {gapNow.toFixed(1)}
              </text>
            </g>
          );
        })}
        <line className="avm-now" x1={x(step)} x2={x(step)} y1={top} y2={top + plotHeight} />
      </svg>
    </div>
  );
}

interface ProcessPanelProps {
  kind: ProcessKey;
  title: string;
  rule: string;
  run: ProcessRun;
  step: number;
  children: React.ReactNode;
}

function ProcessPanel({ kind, title, rule, run, step, children }: ProcessPanelProps) {
  const summary = run.steps[step];
  const verdict = benfordVerdict(summary.benfordRmse, SAMPLE_SIZE);
  const name = kind === "add" ? "Adding" : "Multiplying";
  const titleId = `avm-${kind}-title`;
  return (
    <section className={`avm-process avm-${kind}`} aria-labelledby={titleId}>
      <header>
        <h4 id={titleId}>{title}</h4>
        <p className="avm-rule">{rule}</p>
      </header>
      {children}
      <div className="avm-verdict">
        <span className={`avm-pill is-${verdict}`}>{verdictText[verdict]}</span>
        <small>average gap {(summary.benfordRmse * 100).toFixed(1)} percentage points</small>
      </div>
      <div>
        <p className="avm-chart-label">Where the values are, over time (log scale)</p>
        <PathsChart run={run} step={step} name={name} />
        <p className="avm-chart-note">
          The shaded band holds 95% of values: {formatLogValue(summary.lowerLog)} to{" "}
          {formatLogValue(summary.upperLog)}, about{" "}
          {formatOrders(summary.upperLog - summary.lowerLog)} orders of magnitude.
        </p>
      </div>
      <div>
        <p className="avm-chart-label">Fractional part of log₁₀(X) now</p>
        <FractionalChart summary={summary} name={name} />
      </div>
      <div>
        <p className="avm-chart-label">First digits now</p>
        <div className="avm-legend">
          <span><i className="avm-swatch-process" />This process</span>
          <span><i className="avm-swatch-benford" />Benford</span>
        </div>
        <DigitBars summary={summary} name={name} />
      </div>
    </section>
  );
}

export function AddVsMultiplyLab() {
  const [step, setStep] = useState(TOTAL_STEPS);
  const [playing, setPlaying] = useState(false);
  const [addAmount, setAddAmount] = useState(defaultAddVsMultiplyConfig.addAmount);
  const [multiplyRange, setMultiplyRange] = useState(defaultAddVsMultiplyConfig.multiplyRange);
  const [seed, setSeed] = useState(defaultAddVsMultiplyConfig.seed);
  const frame = useRef<number | null>(null);
  const stepRef = useRef(TOTAL_STEPS);

  const config = useDeferredValue({ ...defaultAddVsMultiplyConfig, addAmount, multiplyRange, seed });
  const run = useMemo(
    () => simulateAddVsMultiply(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.addAmount, config.multiplyRange, config.seed]
  );

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function goTo(next: number) {
    stepRef.current = next;
    setStep(next);
  }

  function stop() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
  }

  function play() {
    if (playing) {
      stop();
      return;
    }
    if (prefersReducedMotion() || typeof requestAnimationFrame !== "function") {
      goTo(TOTAL_STEPS);
      return;
    }
    if (stepRef.current >= TOTAL_STEPS) goTo(0);
    setPlaying(true);
    let last = performance.now();
    let carry = 0;
    const tick = (now: number) => {
      carry += ((now - last) / 1000) * STEPS_PER_SECOND;
      last = now;
      if (carry >= 1) {
        const advance = Math.floor(carry);
        carry -= advance;
        goTo(Math.min(TOTAL_STEPS, stepRef.current + advance));
      }
      if (stepRef.current >= TOTAL_STEPS) {
        frame.current = null;
        setPlaying(false);
        return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  const percent = `${Math.round(multiplyRange * 100)}%`;

  return (
    <section className="avm-lab" aria-labelledby="avm-title">
      <div className="avm-intro">
        <p className="eyebrow">What produces Benford?</p>
        <h3 id="avm-title">Add vs multiply: which one makes Benford?</h3>
        <p>
          Both processes start {SAMPLE_SIZE.toLocaleString("en-US")} values at{" "}
          {defaultAddVsMultiplyConfig.startValue} and change each one a little at every
          step, using the same random draws. The left one adds a random amount each
          step; the right one multiplies by a random percentage. Press Play and watch
          which set of first digits turns into Benford’s.
        </p>
      </div>

      <div className="avm-timebar">
        <div className="avm-actions">
          <button className="secondary-action avm-play" type="button" onClick={play}>
            {playing ? "Pause" : "Play"}
          </button>
          <button className="stack-quiet-action" type="button" onClick={() => setSeed((current) => current + 1)}>
            New random draws
          </button>
        </div>
        <div className="range-field">
          <div className="avm-slider-heading">
            <label htmlFor="avm-step">Number of steps so far</label>
            <span className="avm-slider-value">{step} of {TOTAL_STEPS}</span>
          </div>
          <input
            id="avm-step"
            className="range-slider"
            type="range"
            min={0}
            max={TOTAL_STEPS}
            step={1}
            value={step}
            onChange={(event) => {
              stop();
              goTo(Number(event.target.value));
            }}
          />
        </div>
      </div>

      <div className="avm-duel">
        <ProcessPanel
          kind="add"
          title="Add a random amount"
          rule={`Each step: X ← X + amount, where the amount is between 0 and ${2 * addAmount}. Like a savings balance, or a height built from many small effects.`}
          run={run.add}
          step={step}
        >
          <div className="range-field">
            <div className="avm-slider-heading">
              <label htmlFor="avm-add-amount">Average amount added per step</label>
              <span className="avm-slider-value">{addAmount}</span>
            </div>
            <input
              id="avm-add-amount"
              className="range-slider"
              type="range"
              min={1}
              max={100}
              step={1}
              value={addAmount}
              onChange={(event) => setAddAmount(Number(event.target.value))}
            />
          </div>
        </ProcessPanel>

        <ProcessPanel
          kind="multiply"
          title="Multiply by a random percentage"
          rule={`Each step: X ← X × (1 + change), where the change is between −${percent} and +${percent}. Like a stock price, a population, or compound growth.`}
          run={run.multiply}
          step={step}
        >
          <div className="range-field">
            <div className="avm-slider-heading">
              <label htmlFor="avm-multiply-range">Largest change per step</label>
              <span className="avm-slider-value">±{percent}</span>
            </div>
            <input
              id="avm-multiply-range"
              className="range-slider"
              type="range"
              min={2}
              max={50}
              step={1}
              value={Math.round(multiplyRange * 100)}
              onChange={(event) => setMultiplyRange(Number(event.target.value) / 100)}
            />
          </div>
        </ProcessPanel>
      </div>

      <div className="avm-gap">
        <h4>Distance from Benford at every step</h4>
        <p className="avm-chart-note">
          Average gap between the nine first-digit shares and Benford’s, in percentage
          points. Below the shaded band, the remaining gap is about what random sampling
          alone would leave.
        </p>
        <GapChart add={run.add} multiply={run.multiply} step={step} />
      </div>

      <div className="avm-why">
        <div>
          <h4>Why adding doesn’t get there</h4>
          <p>
            Each new amount is small next to a total that keeps growing. With the
            default settings, after 200 steps of about 10 each, a typical value is near
            2,100, give or take about 4%. The values bunch up inside one order of
            magnitude, so a few first digits take almost everything.
          </p>
        </div>
        <div>
          <h4>Why multiplying does</h4>
          <p>
            Multiplying X adds to log₁₀(X). Those random additions pile up, so the log
            values keep spreading out. Once they span one or two orders of magnitude,
            the fractional parts even out (Step 5 on the “Why it happens” tab), and that
            gives Benford’s digits.
          </p>
        </div>
      </div>
      <p className="avm-takeaway">
        Benford appears when a process spreads values smoothly across several orders
        of magnitude. Repeated multiplication is the most common way that happens.
      </p>
    </section>
  );
}
