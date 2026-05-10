import type { ChangeEvent } from "react";

import type { LabConfig, PresetKey, SimulationMode } from "../lib/presets";

interface SimulationControlsProps {
  config: LabConfig;
  onChange: (config: LabConfig) => void;
  onPresetChange: (preset: PresetKey) => void;
  onRerun: () => void;
}

export function SimulationControls({
  config,
  onChange,
  onPresetChange,
  onRerun
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

  return (
    <form className="control-panel" aria-label="Simulation controls">
      <label>
        Model
        <select value={config.mode} onChange={updateMode}>
          <option value="direct">Lognormal model</option>
          <option value="multiplicative">Multiplicative growth model</option>
        </select>
      </label>

      {config.mode === "direct" ? (
        <>
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
          <section className="model-guidance" aria-label="Lognormal preset definitions">
            <h3>Lognormal presets</h3>
            <p>
              <strong>Narrow:</strong> logs are concentrated in much less than
              one order of magnitude, so fractional logs bunch up and Benford
              usually does not appear.
            </p>
            <p>
              <strong>Transitional:</strong> logs spread across roughly part of
              an order or a few orders, so the first digits may move toward
              Benford but still show structure.
            </p>
            <p>
              <strong>Wide:</strong> logs span many orders of magnitude, making
              fractional logs much closer to uniform and first digits more
              Benford-like.
            </p>
          </section>
        </>
      ) : (
        <section className="model-guidance" aria-label="Multiplicative growth model explanation">
          <h3>Multiplicative growth model</h3>
          <p>
            Model: log10(X_final) = log10(X_start) + sum of random growth
            increments.
          </p>
          <p>
            <strong>Growth mean:</strong> the average log10 change added at each
            step. Positive values drift upward, negative values drift downward,
            and zero means no average drift.
          </p>
          <p>
            <strong>Growth volatility:</strong> how much each step varies around
            the mean. Higher volatility widens the final log distribution
            faster.
          </p>
          <p>
            <strong>Steps:</strong> more steps give more opportunities for log
            increments to accumulate and widen the distribution.
          </p>
        </section>
      )}

      <label>
        Sample size
        <input
          type="number"
          min="100"
          max="50000"
          step="100"
          value={active.sampleSize}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (config.mode === "direct") {
              updateDirect("sampleSize", value);
            } else {
              updateMultiplicative("sampleSize", value);
            }
          }}
        />
      </label>

      {config.mode === "direct" ? (
        <>
          <label>
            Mu
            <input
              type="number"
              step="0.1"
              value={config.direct.mu}
              onChange={(event) => updateDirect("mu", Number(event.target.value))}
            />
          </label>
          <label>
            Sigma
            <input
              type="number"
              min="0"
              max="5"
              step="0.01"
              value={config.direct.sigma}
              onChange={(event) =>
                updateDirect("sigma", Number(event.target.value))
              }
            />
          </label>
        </>
      ) : (
        <>
          <label>
            Starting log10 value
            <input
              type="number"
              step="0.1"
              value={config.multiplicative.log10Start}
              onChange={(event) =>
                updateMultiplicative("log10Start", Number(event.target.value))
              }
            />
          </label>
          <label>
            Steps
            <input
              type="number"
              min="0"
              max="200"
              step="1"
              value={config.multiplicative.steps}
              onChange={(event) =>
                updateMultiplicative("steps", Number(event.target.value))
              }
            />
          </label>
          <label>
            Growth mean
            <input
              type="number"
              step="0.01"
              value={config.multiplicative.growthMean}
              onChange={(event) =>
                updateMultiplicative("growthMean", Number(event.target.value))
              }
            />
          </label>
          <label>
            Growth volatility
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.multiplicative.growthVolatility}
              onChange={(event) =>
                updateMultiplicative(
                  "growthVolatility",
                  Number(event.target.value)
                )
              }
            />
          </label>
        </>
      )}

      <button type="button" className="secondary-action" onClick={onRerun}>
        Rerun sample
      </button>
    </form>
  );
}
