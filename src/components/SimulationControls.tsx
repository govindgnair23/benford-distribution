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
              <strong>Narrow:</strong> log10(X) values cluster tightly, so the
              X values stay within a small scale range and Benford usually does
              not appear.
            </p>
            <p>
              <strong>Transitional:</strong> log10(X) starts spreading across
              more of the log scale, but fractional logs still show structure.
            </p>
            <p>
              <strong>Wide:</strong> log10(X) spans many orders of magnitude,
              so fractional logs can become closer to uniform.
            </p>
          </div>
        </section>
      ) : (
        <section className="model-guidance" aria-label="Multiplicative growth model explanation">
          <h3>Multiplicative growth model</h3>
          <div className="guidance-columns">
            <p>Model: X_final = X_start * G_1 * G_2 * ... * G_n.</p>
            <p>
              <strong>Average growth factor:</strong> the typical multiplier per
              step. For example, 1.02 means about 2% growth per step.
            </p>
            <p>
              <strong>Growth factor volatility:</strong> how much multipliers
              vary around the average. Higher values widen the final
              distribution faster.
            </p>
            <p>
              <strong>Steps:</strong> more multiplications give more
              opportunities for growth factors to accumulate.
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
                onChange={(event) =>
                  updateDirect("mu", Number(event.target.value))
                }
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
              Starting value
              <input
                type="number"
                min="0.01"
                step="10"
                value={config.multiplicative.startValue}
                onChange={(event) =>
                  updateMultiplicative("startValue", Number(event.target.value))
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
              Average growth factor
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={config.multiplicative.growthFactorMean}
                onChange={(event) =>
                  updateMultiplicative(
                    "growthFactorMean",
                    Number(event.target.value)
                  )
                }
              />
            </label>
            <label>
              Growth factor volatility
              <input
                type="number"
                min="0"
                step="0.01"
                value={config.multiplicative.growthFactorVolatility}
                onChange={(event) =>
                  updateMultiplicative(
                    "growthFactorVolatility",
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
      </div>
    </form>
  );
}
