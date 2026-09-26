import { useEffect, useState } from "react";
import { describeNumber, digitLogIntervals } from "../lib/numberMapping";

const examples = [3147, 125, 245, 0.0456, 56700, 6.25, 72000, 850, 9.5];
const stages = ["Number arrives", "Separate digits and scale", "Take a base-10 log", "Keep the fractional part", "Find the first digit"];
const format = (value: number) => value.toFixed(3);

export function NumberMappingAnimation() {
  const [example, setExample] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [uniform, setUniform] = useState(false);
  const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const number = describeNumber(examples[example]);
  const interval = digitLogIntervals[number.digit - 1];
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
          `The fractional log lands in digit ${number.digit}’s interval. The left boundary is included; the right boundary is excluded.`
        ][step]}</p>
      </div>
      <div className="mapping-uniform-control">
        <button className="secondary-action" aria-pressed={uniform} onClick={() => setUniform(!uniform)}>{uniform ? "Hide uniform illustration" : "Show uniform illustration"}</button>
      </div>
      <div className="mapping-track" role="img" aria-label={`First digit intervals on the fractional log scale from 0 to 1.${step === 4 ? ` ${number.value} lands at ${format(number.fractionalLog)} in digit ${number.digit}'s interval.` : ""}`}>
        <div className="mapping-axis"><span>0 = log₁₀(1)</span><span>Fractional log</span><span>1 = log₁₀(10)</span></div>
        <div className="mapping-runway">
          {step >= 3 && <span className={`mapping-marker ${step === 4 ? "has-landed" : ""}`} style={{ left: `${number.fractionalLog * 100}%` }}><span>{format(number.fractionalLog)}</span>▼</span>}
          {uniform && <div className="mapping-uniform" aria-hidden="true">{Array.from({ length: 100 }, (_, index) => <i key={index} style={{ left: `${index + 0.5}%` }} />)}</div>}
        </div>
        <div className="mapping-segments">{digitLogIntervals.map((item) => <div key={item.digit} className={step === 4 && item.digit === number.digit ? "is-selected" : ""} style={{ width: `${item.probability * 100}%` }}><strong>{item.digit}</strong></div>)}</div>
      </div>
      <p className="mapping-result" data-testid="mapping-result" aria-live="polite" aria-atomic="true">
        {step === 4 ? <><strong>Digit {number.digit}:</strong> log₁₀({number.digit}) ≤ {format(number.fractionalLog)} &lt; log₁₀({number.digit + 1})<br />{format(interval.start)} ≤ {format(number.fractionalLog)} &lt; {format(interval.end)}<br /><strong>Interval length: log₁₀({number.digit + 1}) − log₁₀({number.digit}) ≈ {format(interval.probability)} = {(interval.probability * 100).toFixed(1)}% of the scale</strong></> : "The nine regions label first digits. Their positions and widths are measured on the fractional-log scale, from 0 to 1."}
      </p>
      <div className="mapping-conclusion">
        <p><strong>What if fractional logs are uniformly distributed?</strong> Equal-length portions of [0, 1) then receive equal probability. Digit 1 occupies 30.1% of the scale, so it receives 30.1% of values; digit 9 occupies only 4.6%.</p>
        <p>{uniform ? "The evenly spaced marks illustrate uniform coverage, not a random sample. Each digit’s probability is its interval length: log₁₀(d + 1) − log₁₀(d)." : "The example numbers show how mapping works. Landing somewhere in [0, 1) alone does not establish uniformity or Benford’s Law."}</p>
      </div>
    </div>
  );
}
