import { useEffect, useMemo, useRef, useState } from "react";

import { benfordProbability } from "../lib/benford";
import {
  firstDigitShares,
  maxDeviationFromUniform,
  stackFractionalDensities,
  visibleShiftRange,
  wrappedDensityAt
} from "../lib/fractionalStacks";
import { normalDensity } from "../lib/wrappedNormal";

const MEAN = 3.2;
const FRACTIONAL_VALUES = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const STEP_COUNT = FRACTIONAL_VALUES.length;
const MS_PER_VALUE = 750;
const SIGMA_MIN = 0.06;
const SIGMA_MAX = 2;
const SLIDER_MAX = 1000;
const RESTING_FOCUS = 1; // fractional value 0.2

const presets = [
  { label: "Narrow", sigma: 0.1 },
  { label: "In between", sigma: 0.25 },
  { label: "Wide enough", sigma: 0.5 },
  { label: "Very wide", sigma: 1.5 }
];

const sliderToSigma = (value: number) =>
  SIGMA_MIN * Math.pow(SIGMA_MAX / SIGMA_MIN, value / SLIDER_MAX);
const sigmaToSlider = (sigma: number) =>
  Math.round((SLIDER_MAX * Math.log(sigma / SIGMA_MIN)) / Math.log(SIGMA_MAX / SIGMA_MIN));
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function prefersReducedMotion() {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function niceStep(max: number) {
  for (const step of [0.25, 0.5, 1, 2]) if (max / step <= 5.2) return step;
  return 2;
}

function useElementWidth(fallback: number) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

export function WrapAnimation() {
  const [sigma, setSigma] = useState(0.1);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [showSmooth, setShowSmooth] = useState(false);
  const [figureRef, width] = useElementWidth(720);
  const frame = useRef<number | null>(null);
  const progressRef = useRef(0);

  const params = { mean: MEAN, standardDeviation: sigma };
  const model = useMemo(() => {
    const range = visibleShiftRange(params);
    const stacks = stackFractionalDensities({ ...params, ...range, fractionalValues: FRACTIONAL_VALUES });
    const totals = stacks.map((stack) => stack.total);
    const deviation = maxDeviationFromUniform(params);
    const shares = firstDigitShares(params);
    let smoothPeak = 0;
    const smooth = Array.from({ length: 201 }, (_, index) => {
      const density = wrappedDensityAt(index / 200, params);
      smoothPeak = Math.max(smoothPeak, density);
      return { r: index / 200, density };
    });
    const yMax = Math.max(
      1.25,
      normalDensity(MEAN, MEAN, sigma) * 1.08,
      Math.max(...totals) * 1.08,
      smoothPeak * 1.08
    );
    return { range, stacks, totals, deviation, shares, smooth, yMax };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigma]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function setBoth(value: number) {
    progressRef.current = value;
    setProgress(value);
  }

  function animateTo(target: number, from = progressRef.current) {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (prefersReducedMotion() || typeof requestAnimationFrame !== "function") {
      setBoth(target);
      setPlaying(false);
      return;
    }
    const start = performance.now();
    const duration = MS_PER_VALUE * Math.abs(target - from);
    setPlaying(true);
    const tick = (now: number) => {
      const value = duration ? from + (target - from) * Math.min(1, (now - start) / duration) : target;
      setBoth(value);
      if (value === target) {
        frame.current = null;
        setPlaying(false);
      } else {
        frame.current = requestAnimationFrame(tick);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }

  function play() {
    const from = progressRef.current >= STEP_COUNT ? 0 : progressRef.current;
    setBoth(from);
    animateTo(STEP_COUNT, from);
  }

  function nextValue() {
    animateTo(Math.min(STEP_COUNT, Math.floor(progressRef.current + 1e-6) + 1));
  }

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    setPlaying(false);
    setBoth(0);
  }

  // ---------- geometry ----------
  const compact = width < 520;
  const left = compact ? 44 : 56;
  const right = 14;
  const plotWidth = Math.max(200, width - left - right);
  const panelHeight = compact ? 140 : 170;
  const topTop = 34;
  const topBase = topTop + panelHeight;
  const bottomTop = topBase + 78;
  const bottomBase = bottomTop + panelHeight;
  const height = bottomBase + 30;
  const pxPerDensity = panelHeight / model.yMax;
  const { minShift, maxShift } = model.range;
  const span = maxShift - minShift;
  const xTop = (x: number) => left + ((x - minShift) / span) * plotWidth;
  const xBottom = (r: number) => left + (r / 1.1) * plotWidth;
  const barWidth = Math.max(8, (plotWidth / 11) * 0.6);
  const stackedCount = Math.floor(progress + 1e-6);
  const focus = hover ?? (progress <= 0 || progress >= STEP_COUNT ? RESTING_FOCUS : clamp(Math.ceil(progress) - 1, 0, STEP_COUNT - 1));

  const yStep = niceStep(model.yMax);
  const yTicks: number[] = [];
  for (let value = 0; value <= model.yMax + 1e-9; value += yStep) yTicks.push(value);
  const labelEvery = Math.max(1, Math.ceil((span * 30) / plotWidth));

  const curvePoints = Array.from({ length: 301 }, (_, index) => {
    const x = minShift + (index / 300) * span;
    return `${xTop(x).toFixed(1)},${(topBase - normalDensity(x, MEAN, sigma) * pxPerDensity).toFixed(1)}`;
  }).join(" ");
  const smoothPoints = model.smooth
    .map(({ r, density }) => `${xBottom(r).toFixed(1)},${(bottomBase - density * pxPerDensity).toFixed(1)}`)
    .join(" ");

  function focusFromPointer(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const py = ((event.clientY - rect.top) / rect.height) * height;
    if (px < left || px > left + plotWidth) return null;
    const u = (px - left) / plotWidth;
    let r: number;
    if (py < topBase + 40) {
      const value = minShift + u * span;
      r = value - Math.floor(value);
      if (r < 0.05) r += 1;
    } else {
      r = u * 1.1;
    }
    return clamp(Math.round(r * 10) - 1, 0, STEP_COUNT - 1);
  }

  // ---------- text ----------
  const low = Math.min(...model.totals);
  const high = Math.max(...model.totals);
  const worst = Math.max(...model.totals.map((total) => Math.abs(total - 1)));
  let caption: string;
  if (progress <= 0) {
    caption = "The curve is the distribution of log₁₀(X). Each thin line is its density at a point with fractional part 0.1, 0.2, …, or 1.0. Press Play to add up the lines for each fractional value, one value at a time.";
  } else if (progress < STEP_COUNT) {
    const index = clamp(Math.ceil(progress) - 1, 0, STEP_COUNT - 1);
    const examples = model.stacks[index].contributions.slice(0, 3).map((point) => point.x.toFixed(1)).join(", ");
    caption = `Fractional value ${FRACTIONAL_VALUES[index].toFixed(1)}: the density lines at ${examples}, … drop down and stack into one bar.`;
  } else if (worst > 0.25) {
    caption = `Most of log₁₀(X) sits close to ${MEAN.toFixed(1)}, so the bars near fractional value 0.2 collect almost all the density. The totals run from ${low.toFixed(2)} to ${high.toFixed(2)}, which is not uniform.`;
  } else if (worst > 0.05) {
    caption = `The totals run from ${low.toFixed(2)} to ${high.toFixed(2)}. They are getting closer to 1, but are not uniform yet.`;
  } else {
    caption = `Every bar collects many small pieces, and every total lands near 1 (${low.toFixed(2)} to ${high.toFixed(2)}). The result is uniform, which gives Benford.`;
  }

  const focusStack = model.stacks[focus];
  const shownTerms = focusStack.contributions
    .filter((point) => point.density >= 0.0005)
    .sort((a, b) => b.density - a.density)
    .slice(0, 5)
    .sort((a, b) => a.x - b.x);
  const hiddenTerms = focusStack.contributions.length - shownTerms.length;
  const termParts = shownTerms.map((point) => `f(${point.x.toFixed(1)}) ${point.density.toFixed(3)}`);
  if (termParts.length === 0) termParts.push("every term ≈ 0");
  else if (hiddenTerms > 0) termParts.push(`${hiddenTerms} more term${hiddenTerms === 1 ? "" : "s"} near 0`);
  const firstPoints = focusStack.contributions.slice(0, 4).map((point) => point.x.toFixed(1)).join(", ");

  const spread = 3.92 * sigma;
  const shareTop = Math.max(0.35, ...model.shares) * 1.08;
  const benfordGap = Math.max(...model.shares.map((share, index) => Math.abs(share - benfordProbability(index + 1))));
  const fontSize = compact ? 10 : 11;

  return (
    <section className="wrap-animation" aria-label="Stacking densities by fractional value">
      <div className="wrap-animation-heading">
        <div>
          <p className="eyebrow">Watch the totals</p>
          <h4>Add up the density at each fractional value</h4>
        </div>
        <div className="stack-actions">
          <button className="secondary-action stack-play" type="button" onClick={play} disabled={playing}>
            {playing ? "Playing…" : progress >= STEP_COUNT ? "Replay" : "Play"}
          </button>
          <button className="stack-quiet-action" type="button" onClick={nextValue} disabled={playing || progress >= STEP_COUNT}>
            Next value
          </button>
          <button className="stack-quiet-action" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="stack-controls">
        <div className="wrap-animation-switch" role="group" aria-label="Spread presets">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={Math.abs(preset.sigma - sigma) < 0.004}
              onClick={() => setSigma(preset.sigma)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="range-field stack-sigma">
          <div className="stack-sigma-heading">
            <label htmlFor="stack-sigma">Spread of log₁₀(X), σ</label>
            <span className="stack-sigma-value" aria-live="polite">{sigma.toFixed(2)}</span>
          </div>
          <input
            id="stack-sigma"
            className="range-slider"
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={1}
            value={sigmaToSlider(sigma)}
            onChange={(event) => setSigma(sliderToSigma(Number(event.target.value)))}
          />
        </div>
      </div>

      <div className="stack-figure" ref={figureRef}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          height={height}
          role="img"
          aria-label={`Density lines of log₁₀(X) and their totals: ${stackedCount} of ${STEP_COUNT} fractional values stacked`}
          onPointerMove={(event) => setHover(focusFromPointer(event))}
          onPointerLeave={() => setHover(null)}
        >
          <text className="stack-title" x={left} y={topTop - 14} fontSize={fontSize + 2}>
            Distribution of log₁₀(X), with density lines at each fractional value
          </text>
          <text className="stack-title" x={left} y={bottomTop - 14} fontSize={fontSize + 2}>
            Density added up for each fractional value
          </text>

          {[[topTop, topBase], [bottomTop, bottomBase]].map(([panelTop, base]) => (
            <g key={panelTop}>
              {yTicks.map((value) => (
                <g key={value}>
                  <line className="stack-grid" x1={left} x2={left + plotWidth} y1={base - value * pxPerDensity} y2={base - value * pxPerDensity} />
                  <text className="stack-tick" x={left - 8} y={base - value * pxPerDensity + 4} textAnchor="end" fontSize={fontSize}>
                    {Number.isInteger(value) ? value : value.toFixed(2).replace(/0$/, "")}
                  </text>
                </g>
              ))}
              <text className="stack-tick" transform={`translate(12,${(panelTop + base) / 2}) rotate(-90)`} textAnchor="middle" fontSize={fontSize}>
                density
              </text>
            </g>
          ))}

          <line className="stack-uniform" x1={left} x2={left + plotWidth} y1={bottomBase - pxPerDensity} y2={bottomBase - pxPerDensity} />
          <text className="stack-uniform-label" x={left + plotWidth - 4} y={bottomBase - pxPerDensity - 5} textAnchor="end" fontSize={fontSize}>
            uniform = 1
          </text>

          {Array.from({ length: span + 1 }, (_, index) => minShift + index)
            .filter((shift) => (shift - minShift) % labelEvery === 0)
            .map((shift) => (
              <text key={shift} className="stack-tick stack-tick-strong" x={xTop(shift)} y={topBase + 16} textAnchor="middle" fontSize={fontSize}>
                {shift}
              </text>
            ))}
          <text className="stack-tick" x={left + plotWidth} y={topBase + 32} textAnchor="end" fontSize={fontSize}>
            log₁₀(X)
          </text>
          <polyline className="stack-curve" points={curvePoints} />

          <text className="stack-tick" x={left} y={bottomBase + 16} textAnchor="middle" fontSize={fontSize}>0</text>
          {FRACTIONAL_VALUES.map((r) => (
            <text key={r} className="stack-tick stack-tick-strong" x={xBottom(r)} y={bottomBase + 16} textAnchor="middle" fontSize={fontSize}>
              {r.toFixed(1)}
            </text>
          ))}
          {showSmooth && <polyline className="stack-smooth" points={smoothPoints} />}

          {model.stacks.map((stack, index) => {
            const local = progress - index;
            const count = stack.contributions.length;
            const stagger = count > 1 ? Math.min(0.05, 0.35 / (count - 1)) : 0;
            const travel = 1 - (count - 1) * stagger;
            const highlighted = index === focus || (local > 0 && local < 1);
            const barCenter = xBottom(stack.fractionalValue);
            return (
              <g key={stack.fractionalValue}>
                {stack.contributions.map((point, pointIndex) => {
                  const p = ease(clamp((local - pointIndex * stagger) / travel, 0, 1));
                  const h = point.density * pxPerDensity;
                  const x0 = xTop(point.x);
                  const w = 2 + (barWidth - 2) * p;
                  const cx = x0 + (barCenter - x0) * p;
                  const yBase = topBase + (bottomBase - point.base * pxPerDensity - topBase) * p;
                  const className = p >= 1
                    ? "stack-piece"
                    : highlighted ? "stack-line is-active" : "stack-line";
                  return (
                    <g key={point.x}>
                      {p > 0 && p < 1 && (
                        <rect className="stack-line-trace" x={x0 - 1} y={topBase - h} width={2} height={h} />
                      )}
                      <rect className={className} x={cx - w / 2} y={yBase - h} width={w} height={Math.max(0, h)} />
                    </g>
                  );
                })}
                {local >= 1 && (
                  <text className="stack-total" x={barCenter} y={bottomBase - stack.total * pxPerDensity - 5} textAnchor="middle" fontSize={fontSize - 1}>
                    {stack.total.toFixed(2)}
                  </text>
                )}
                {index === focus && (
                  <rect className="stack-focus" x={barCenter - barWidth / 2 - 3} y={bottomTop} width={barWidth + 6} height={panelHeight} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <label className="stack-smooth-toggle">
        <input type="checkbox" checked={showSmooth} onChange={(event) => setShowSmooth(event.target.checked)} />
        Also show the total at every fractional value, not just these ten
      </label>
      <p className="stack-note">
        Both charts use the same density scale; the dashed line at 1 is what a uniform
        result looks like. A fractional value of 1.0 is the same as 0.0: 3.0 and 4.0 both
        have fractional part 0. Hover over a bar or its lines to see the sum.
      </p>
      <p className="stack-caption" aria-live="polite">{caption}</p>
      <div className="stack-readout">
        <div className="stack-readout-lead">
          Fractional value <b>{focusStack.fractionalValue.toFixed(1)}</b>: add the density at {firstPoints}, …
          {focusStack.fractionalValue === 1 ? " (the same as fractional value 0.0)" : ""}
        </div>
        <div className="stack-readout-terms">
          total = {termParts.join(" + ")} = <b>{focusStack.total.toFixed(3)}</b>
        </div>
      </div>

      <div className="stack-results">
        <div>
          <h5>First digits this curve produces</h5>
          <div className="stack-legend">
            <span><i className="stack-swatch-share" />Share from this Normal</span>
            <span><i className="stack-swatch-benford" />Benford</span>
          </div>
          <div
            className="stack-digits"
            role="img"
            aria-label={`First-digit shares compared with Benford: ${model.shares
              .map((share, index) => `${index + 1}: ${(share * 100).toFixed(1)}% vs Benford ${(benfordProbability(index + 1) * 100).toFixed(1)}%`)
              .join("; ")}`}
          >
            {model.shares.map((share, index) => (
              <div className="stack-digit" key={index} aria-hidden="true">
                <span className="stack-digit-value">{(share * 100).toFixed(1)}</span>
                <div className="stack-digit-column">
                  <div className="stack-digit-bar" style={{ height: `${(share / shareTop) * 100}%` }} />
                  <div className="stack-digit-benford" style={{ bottom: `${(benfordProbability(index + 1) / shareTop) * 100}%` }} />
                </div>
                <span className="stack-digit-label">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <dl className="stack-stats">
          <div>
            <dt>How spread out X is</dt>
            <dd>about {spread < 1 ? spread.toFixed(2) : spread.toFixed(1)} orders of magnitude (middle 95%)</dd>
          </div>
          <div>
            <dt>The ten totals</dt>
            <dd>{low.toFixed(2)} to {high.toFixed(2)}</dd>
          </div>
          <div>
            <dt>Furthest from 1, at any fractional value</dt>
            <dd>{(model.deviation * 100).toFixed(model.deviation < 0.1 ? 1 : 0)}%</dd>
          </div>
          <div>
            <dt>Largest gap to Benford</dt>
            <dd>{(benfordGap * 100).toFixed(1)} percentage points</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
