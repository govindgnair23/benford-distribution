import { useEffect, useMemo, useState } from "react";
import { FormulaBlock } from "./FormulaBlock";
import { benfordProbability } from "../lib/benford";
import {
  describeNumber,
  digitLogIntervals,
  sampleNumbers,
  spreadPresets,
  tallyFirstDigits,
  tallyFractionalLogs,
  type SpreadPreset
} from "../lib/numberMapping";

// Consecutive pairs straddle each internal digit boundary, log₁₀(2) … log₁₀(9).
const examples = [1990, 2010, 2990, 3010, 3990, 4010, 4990, 5010, 5990, 6010, 6990, 7010, 7990, 8010, 8990, 9010];
const stages = ["Number arrives", "Separate digits and scale", "Take a base-10 log", "Keep the fractional part", "Find the first digit"];
const format = (value: number) => value.toFixed(4);

export function NumberMappingAnimation() {
  const [example, setExample] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const number = describeNumber(examples[example]);
  const interval = digitLogIntervals[number.digit - 1];
  const boundaryDigit = Math.floor(example / 2) + 2;
  const boundarySide = example % 2 === 0 ? "below" : "above";
  const significandLabel = number.significand.toPrecision(4).replace(/0+$/, "").replace(/\.$/, "");

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (step < 4) setStep(step + 1);
      else if (example < examples.length - 1) { setExample(example + 1); setStep(0); }
      else setPlaying(false);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [playing, step, example, reducedMotion]);

  function next() {
    setPlaying(false);
    if (step < 4) setStep(step + 1);
    else { setExample((example + 1) % examples.length); setStep(0); }
  }

  return (
    <div className="number-mapping">
      <div className="mapping-controls">
        <label>Example number <select value={examples[example]} onChange={(event) => {
          setExample(examples.indexOf(Number(event.target.value))); setStep(0); setPlaying(false);
        }}>{examples.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <button className="secondary-action" onClick={() => {
          if (reducedMotion) { setStep(4); return; }
          if (!playing && step === 4 && example === examples.length - 1) { setExample(0); setStep(0); }
          setPlaying(!playing);
        }}>{reducedMotion ? "Show mapping" : playing ? "Pause" : "Play"}</button>
        <button className="secondary-action" onClick={next}>Next step</button>
        <span>Step {step + 1} of 5 · Example {example + 1} of {examples.length}</span>
      </div>
      <div className="mapping-stage" data-testid="mapping-stage" aria-live="polite" aria-atomic="true">
        <p className="eyebrow">{stages[step]}</p>
        <div className="mapping-equation" key={`${example}-${step}`}>
          {step === 0 && <strong>{number.value}</strong>}
          {step === 1 && <><strong>{significandLabel}</strong> × 10<sup>{number.exponent}</sup></>}
          {step === 2 && <div className="mapping-log-chain">
            <span>log₁₀({number.value})</span>{" "}
            <span>= log₁₀({significandLabel} × 10<sup>{number.exponent}</sup>)</span>{" "}
            <span>= <span className="mapping-scale">{number.exponent}</span> + log₁₀({significandLabel})</span>{" "}
            <span>≈ <span className="mapping-scale">{number.exponent}</span> + <strong>{format(number.fractionalLog)}</strong></span>
          </div>}
          {step === 3 && <>{format(number.logValue)} − ({number.exponent}) ≈ <strong>{format(number.fractionalLog)}</strong></>}
          {step === 4 && <><span>{number.value}</span> → <strong>{format(number.fractionalLog)}</strong> → First digit: <strong>{number.digit}</strong></>}
        </div>
        <p>{[
          "Start with a positive number. Watch its first digit survive each transformation.",
          "Significand: the factor between 1 and 10. Exponent: the power of ten that sets the scale.",
          "The log of a product becomes a sum. The scale contributes an integer; the significand contributes a fraction.",
          "Subtract the floor of the log, including for numbers below 1. The result always lies in [0, 1).",
          `The fractional log is just ${boundarySide} log₁₀(${boundaryDigit}), so it lands in digit ${number.digit}’s interval. The left boundary is included; the right boundary is excluded.`
        ][step]}</p>
      </div>
      <div className="mapping-track" role="img" aria-label={`First digit intervals on the fractional log scale from 0 to 1.${step === 4 ? ` ${number.value} lands at ${format(number.fractionalLog)} in digit ${number.digit}'s interval.` : ""}`}>
        <div className="mapping-axis"><span>0 = log₁₀(1)</span><span>Fractional log</span><span>1 = log₁₀(10)</span></div>
        <div className="mapping-runway">
          {step >= 3 && <span className={`mapping-marker ${step === 4 ? "has-landed" : ""}`} style={{ left: `${number.fractionalLog * 100}%` }}><span>{format(number.fractionalLog)}</span>▼</span>}
        </div>
        <div className="mapping-segments">{digitLogIntervals.map((item) => <div key={item.digit} className={step === 4 && item.digit === number.digit ? "is-selected" : ""} style={{ width: `${item.probability * 100}%` }}><strong>{item.digit}</strong></div>)}</div>
      </div>
      <p className="mapping-result" data-testid="mapping-result" aria-live="polite" aria-atomic="true">
        {step === 4 ? <><strong>Digit {number.digit}:</strong> log₁₀({number.digit}) ≤ {format(number.fractionalLog)} &lt; log₁₀({number.digit + 1})<br />{format(interval.start)} ≤ {format(number.fractionalLog)} &lt; {format(interval.end)}<br /><strong>Interval length: log₁₀({number.digit + 1}) − log₁₀({number.digit}) ≈ {interval.probability.toFixed(3)} ≈ {(interval.probability * 100).toFixed(1)}% of the scale</strong></> : "The nine regions label first digits. Their positions and widths are measured on the fractional-log scale, from 0 to 1."}
      </p>
      <div className="mapping-conclusion">
        <p><strong>What if fractional logs are uniformly distributed?</strong> Each digit then has a probability proportional to the length of its interval on the fractional-log scale. Digit 1 occupies 30.1% of the scale, so it receives 30.1% of values; digit 9 occupies only 4.6%.</p>
        <p>Because the whole scale has length 1, each interval’s length is its probability. This gives Benford’s probability mass function (PMF), where D is the first digit:</p>
        <FormulaBlock
          label="From interval length to Benford’s PMF"
          accessibilityLabel="Uniform fractional logs give Benford first-digit probabilities"
          formula={String.raw`\begin{aligned}P(D=d)&=\log_{10}(d+1)-\log_{10}(d)\\&=\log_{10}\!\left(\frac{1+d}{d}\right),\quad d=1,\ldots,9.\end{aligned}`}
        />
        <p className="key-requirement"><strong>Uniform fractional logs are the key condition behind this derivation.</strong> Uniformity on [0, 1) gives Benford’s PMF exactly; approximate uniformity gives approximately Benford probabilities. Simply landing in [0, 1) is not enough.</p>
        <p>One example number shows how the mapping works, but a single landing spot says nothing about uniformity. Drop in many numbers below to see both distributions at once.</p>
      </div>
      <NumberCrowd />
    </div>
  );
}

const CROWD_TOTAL = 2000;
const CROWD_BATCH = 10;
const CROWD_TICK_MS = 50;
const FRACTION_BINS = 10;
const DOT_COUNT = 60;

function formatPlainValue(value: number) {
  return Number(value.toPrecision(2)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

const spreadOptions: Array<{ key: SpreadPreset; label: string }> = [
  { key: "wide", label: "Many orders of magnitude" },
  { key: "narrow", label: "Within one order of magnitude" }
];

function NumberCrowd() {
  const [spread, setSpread] = useState<SpreadPreset>("wide");
  const numbers = useMemo(
    () => sampleNumbers({ count: CROWD_TOTAL, seed: 11, ...spreadPresets[spread] }),
    [spread]
  );
  // Scales come from the full set so bars grow during the drop instead of rescaling.
  const full = useMemo(() => {
    const logs = numbers.map((number) => number.logValue).sort((a, b) => a - b);
    const low = logs[Math.floor(0.025 * logs.length)];
    const high = logs[Math.floor(0.975 * logs.length)];
    return {
      low,
      high,
      maxBin: Math.max(...tallyFractionalLogs(numbers, FRACTION_BINS)),
      maxShare: Math.max(...tallyFirstDigits(numbers)) / numbers.length
    };
  }, [numbers]);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const next = Math.min(CROWD_TOTAL, shown + CROWD_BATCH);
      setShown(next);
      if (next >= CROWD_TOTAL) setRunning(false);
    }, CROWD_TICK_MS);
    return () => window.clearTimeout(timer);
  }, [running, shown]);

  function drop() {
    if (reducedMotion) {
      setShown(CROWD_TOTAL);
      return;
    }
    if (running) {
      setRunning(false);
      return;
    }
    if (shown >= CROWD_TOTAL) setShown(0);
    setRunning(true);
  }

  const visible = numbers.slice(0, shown);
  const bins = tallyFractionalLogs(visible, FRACTION_BINS);
  const digits = tallyFirstDigits(visible);
  const expectedPerBin = CROWD_TOTAL / FRACTION_BINS;
  const binScale = Math.max(expectedPerBin * 1.5, full.maxBin * 1.05);
  const uniformLevel = shown / FRACTION_BINS;
  const dots = visible.slice(-DOT_COUNT);
  const share = (count: number) => (shown ? count / shown : 0);
  const digitScale = Math.max(0.36, full.maxShare * 1.08);
  const orders = full.high - full.low;
  const digitOneShare = share(digits[0]) * 100;
  const buttonLabel = reducedMotion ? "Drop numbers" : running ? "Pause" : shown >= CROWD_TOTAL ? "Drop again" : "Drop numbers";

  return (
    <section className="crowd" aria-labelledby="crowd-title">
      <header className="crowd-header">
        <h4 id="crowd-title">Many numbers at once</h4>
        <p>
          The middle 95% of these {CROWD_TOTAL.toLocaleString("en-US")} numbers run from
          about {formatPlainValue(10 ** full.low)} to {formatPlainValue(10 ** full.high)}:
          about {orders < 1 ? orders.toFixed(1) : Math.round(orders)} orders of magnitude.
          Each one lands at its fractional log on the same 0-to-1 scale.
        </p>
      </header>
      <div className="wrap-animation-switch" role="group" aria-label="How spread out the numbers are">
        {spreadOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={spread === option.key}
            onClick={() => setSpread(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mapping-controls">
        <button className="secondary-action" type="button" onClick={drop}>{buttonLabel}</button>
        {!reducedMotion && (
          <button className="stack-quiet-action" type="button" onClick={() => { setRunning(false); setShown(CROWD_TOTAL); }}>
            Show all
          </button>
        )}
        <span data-testid="crowd-count">{shown.toLocaleString("en-US")} of {CROWD_TOTAL.toLocaleString("en-US")} numbers</span>
      </div>
      <div className="crowd-panels">
        <div>
          <p className="crowd-label">Log scale: fractional part of log₁₀(X)</p>
          <div
            className="crowd-bins"
            role="img"
            aria-label={`Fractional logs of ${shown} numbers, count in each tenth of [0, 1): ${bins.join(", ")}`}
          >
            {bins.map((count, index) => (
              <div key={index} className="crowd-bin" style={{ height: `${Math.min(100, (count / binScale) * 100)}%` }} />
            ))}
            {shown > 0 && (
              <div className="crowd-uniform" style={{ bottom: `${Math.min(100, (uniformLevel / binScale) * 100)}%` }}>
                <span>uniform</span>
              </div>
            )}
          </div>
          <div className="mapping-segments crowd-segments" aria-hidden="true">
            {digitLogIntervals.map((item) => (
              <div key={item.digit} style={{ width: `${item.probability * 100}%` }}><strong>{item.digit}</strong></div>
            ))}
            {dots.map((number, index) => (
              <i key={`${shown}-${index}`} className="crowd-dot" style={{ left: `${number.fractionalLog * 100}%` }} />
            ))}
          </div>
          <div className="mapping-axis"><span>0</span><span>1</span></div>

        </div>

        <div>
          <p className="crowd-label">Original scale: first digit of X</p>
          <div
            className="crowd-digits"
            role="img"
            aria-label={`First digits of ${shown} numbers compared with Benford: ${digits
              .map((count, index) => `${index + 1}: ${(share(count) * 100).toFixed(1)}% vs Benford ${(benfordProbability(index + 1) * 100).toFixed(1)}%`)
              .join("; ")}`}
          >
            {digits.map((count, index) => (
              <div className="crowd-digit" key={index} aria-hidden="true">
                <span className="crowd-digit-value">{shown ? (share(count) * 100).toFixed(1) : "–"}</span>
                <div className="crowd-digit-column">
                  <div className="crowd-digit-bar" style={{ height: `${Math.min(100, (share(count) / digitScale) * 100)}%` }} />
                  <div className="crowd-digit-benford" style={{ bottom: `${(benfordProbability(index + 1) / digitScale) * 100}%` }} />
                </div>
                <span className="crowd-digit-label">{index + 1}</span>
              </div>
            ))}
          </div>
          <div className="crowd-legend">
            <span><i className="crowd-swatch-share" />These numbers (%)</span>
            <span><i className="crowd-swatch-benford" />Benford</span>
          </div>
        </div>
      </div>

      <p className="crowd-conclusion" aria-live="polite">
        {spread === "wide"
          ? shown >= CROWD_TOTAL / 2
            ? "The fractional logs are roughly uniform, but the first digits follow Benford: each digit receives a share proportional to its interval’s length."
            : "Watch the two charts fill in. On the log scale the bars rise evenly; on the original scale digit 1 pulls ahead."
          : shown >= CROWD_TOTAL / 2
            ? `In this example, fractional logs cluster and are not uniform. The first digits are not Benford: digit 1 gets ${digitOneShare.toFixed(1)}% instead of 30.1%.`
            : "Watch the two charts fill in. On the log scale the bars pile up in the middle instead of rising evenly."}
      </p>
    </section>
  );
}
