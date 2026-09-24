import type { ChangeEvent } from "react";

import { LOG_WIDTH_THRESHOLDS } from "../lib/diagnostics";
import type { LabConfig, PresetKey, SimulationMode } from "../lib/presets";

interface SimulationControlsProps {
  config: LabConfig;
  onChange: (config: LabConfig) => void;
  onPresetChange: (preset: PresetKey) => void;
  onRerun: () => void;
  isRegenerating?: boolean;
}

// Parse a raw input string, ignoring empty / NaN values (so a cleared field
// never simulates), and clamp finite values into [min, max]. Returns null when
// the value should be ignored and the last valid config kept.
function clampInput(raw: string, min: number, max: number): number | null {
  if (raw.trim() === "") {
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return Math.min(max, Math.max(min, parsed));
}

interface RangeNumberFieldProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onValue: (value: number) => void;
}

// Paired range slider + number input kept in sync; both commit through the same
// clamp path. The number input carries the visible <label>; the slider carries
// a distinct aria-label so assistive tech announces it separately.
function RangeNumberField({
  label,
  min,
  max,
  step,
  value,
  onValue
}: RangeNumberFieldProps) {
  function commit(raw: string) {
    const next = clampInput(raw, min, max);
    if (next !== null) {
      onValue(next);
    }
  }

  return (
    <div className="range-field">
      <label>
        {label}
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => commit(event.target.value)}
        />
      </label>
      <input
        type="range"
        className="range-slider"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => commit(event.target.value)}
      />
    </div>
  );
}

export function SimulationControls({
  config,
  onChange,
  onPresetChange,
  onRerun,
  isRegenerating = false
}: SimulationControlsProps) {
  const active = config.mode === "direct" ? config.direct : config.multiplicative;
  const lognormalPreset =
    config.preset === "multiplicative" ? "narrow" : config.preset;

  function updateMode(event: ChangeEvent<HTMLSelectElement>) {
    const mode = event.target.value as SimulationMode;
    if (mode === "multiplicative") {
      onPresetChange("multiplicative");
      return;
    }

    onPresetChange(lognormalPreset);
  }

  function updateDirect(field: keyof LabConfig["direct"], value: number) {
    onChange({
      ...config,
      direct: { ...config.direct, [field]: value }
    });
  }

  function updateMultiplicative(
    field: keyof LabConfig["multiplicative"],
    value: number
  ) {
    onChange({
      ...config,
      multiplicative: { ...config.multiplicative, [field]: value }
    });
  }

  function commitNumber(
    raw: string,
    min: number,
    max: number,
    apply: (value: number) => void
  ) {
    const next = clampInput(raw, min, max);
    if (next !== null) {
      apply(next);
    }
  }

  return (
    <form className="control-panel" aria-label="Simulation controls">
      <div className="control-row">
        <label>
          Model
          <select value={config.mode} onChange={updateMode}>
            <option value="direct">Lognormal model</option>
            <option value="multiplicative">Multiplicative growth model</option>
          </select>
        </label>

        {config.mode === "direct" ? (
          <label>
            Lognormal preset
            <select
              value={lognormalPreset}
              onChange={(event) => onPresetChange(event.target.value as PresetKey)}
            >
              <option value="narrow">Narrow</option>
              <option value="transitional">Transitional</option>
              <option value="wide">Wide</option>
            </select>
          </label>
        ) : (
          <div className="control-row-spacer" aria-hidden="true" />
        )}
      </div>

      {config.mode === "direct" ? (
        <section className="model-guidance" aria-label="Lognormal preset definitions">
          <h3>Lognormal presets</h3>
          <div className="guidance-columns">
            <p>
              <strong>Model:</strong> log₁₀(X) ~ Normal(μ, σ²), then X =
              10^log₁₀(X). Here μ and σ describe log₁₀(X), not X itself.
            </p>
            <p>
              <strong>Narrow:</strong> log₁₀(X) values cluster tightly, so the
              X values stay within a small scale range and Benford usually does
              not appear.
            </p>
            <p>
              <strong>Transitional:</strong> log₁₀(X) starts spreading across
              more of the log scale. Fractional logs may still show structure,
              while the first digits can already match Benford closely.
            </p>
            <p>
              <strong>Wide:</strong> log₁₀(X) spans many orders of magnitude,
              so fractional logs can become closer to uniform.
            </p>
          </div>
          <p className="guidance-threshold">
            These are teaching categories based only on SD(log₁₀ X), not
            thresholds for Benford conformity. Below{" "}
            {LOG_WIDTH_THRESHOLDS.narrowMax} reads as narrow,{" "}
            {LOG_WIDTH_THRESHOLDS.narrowMax}–{LOG_WIDTH_THRESHOLDS.wideMin} as
            transitional, and {LOG_WIDTH_THRESHOLDS.wideMin} or above as wide.
          </p>
        </section>
      ) : (
        <section className="model-guidance" aria-label="Multiplicative growth model explanation">
          <h3>Multiplicative growth model</h3>
          <div className="guidance-columns">
            <p>
              <strong>Model:</strong> X_final = X_start * G_1 * G_2 * ... * G_n,
              where Gᵢ ~ Normal(μ_G, σ_G²), restricted to Gᵢ &gt; 0.
            </p>
            <p>
              <strong>Factor Normal mean:</strong> μ_G is the mean of the
              underlying Normal distribution before nonpositive draws are
              rejected. The accepted factors' actual average can be slightly
              higher.
            </p>
            <p>
              <strong>Factor Normal standard deviation:</strong> σ_G is the
              standard deviation of that underlying Normal distribution. It is
              measured in multiplier units, so 0.18 means an SD of 0.18.
            </p>
            <p>
              <strong>Sample:</strong> each observation follows an independent
              path with newly drawn factors for every step, starting from the
              same X_start.
            </p>
          </div>
        </section>
      )}

      <div className="control-row">
        <label>
          Sample size
          <input
            type="number"
            min="100"
            max="50000"
            step="100"
            value={active.sampleSize}
            onChange={(event) => {
              commitNumber(event.target.value, 100, 50000, (value) => {
                if (config.mode === "direct") {
                  updateDirect("sampleSize", value);
                } else {
                  updateMultiplicative("sampleSize", value);
                }
              });
            }}
          />
        </label>

        {config.mode === "direct" ? (
          <>
            <label>
              Mean of log₁₀(X) (μ)
              <input
                type="number"
                step="0.1"
                value={config.direct.mu}
                onChange={(event) =>
                  commitNumber(event.target.value, -Infinity, Infinity, (value) =>
                    updateDirect("mu", value)
                  )
                }
              />
            </label>
            <RangeNumberField
              label="Standard deviation of log₁₀(X) (σ)"
              min={0}
              max={2.5}
              step={0.01}
              value={config.direct.sigma}
              onValue={(value) => updateDirect("sigma", value)}
            />
          </>
        ) : (
          <>
            <label>
              Starting value
              <input
                type="number"
                min="0.01"
                step="10"
                value={config.multiplicative.startValue}
                onChange={(event) =>
                  commitNumber(event.target.value, 0.01, Infinity, (value) =>
                    updateMultiplicative("startValue", value)
                  )
                }
              />
            </label>
            <RangeNumberField
              label="Steps"
              min={0}
              max={200}
              step={1}
              value={config.multiplicative.steps}
              onValue={(value) => updateMultiplicative("steps", value)}
            />
            <label>
              Factor Normal mean (μ_G)
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={config.multiplicative.growthFactorMean}
                onChange={(event) =>
                  commitNumber(event.target.value, 0.01, Infinity, (value) =>
                    updateMultiplicative("growthFactorMean", value)
                  )
                }
              />
            </label>
            <RangeNumberField
              label="Factor Normal standard deviation (σ_G)"
              min={0}
              max={0.5}
              step={0.01}
              value={config.multiplicative.growthFactorVolatility}
              onValue={(value) =>
                updateMultiplicative("growthFactorVolatility", value)
              }
            />
          </>
        )}

        <button
          type="button"
          className="secondary-action"
          onClick={onRerun}
          disabled={isRegenerating}
        >
          Draw another sample
        </button>
      </div>
      <p className="guidance-threshold">
        Controls update the current results automatically. The Draw another
        sample button keeps these settings and uses a new random seed.
      </p>
    </form>
  );
}
