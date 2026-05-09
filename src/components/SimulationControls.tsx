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

  function updateMode(event: ChangeEvent<HTMLSelectElement>) {
    onChange({ ...config, mode: event.target.value as SimulationMode });
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
        Preset
        <select
          value={config.preset}
          onChange={(event) => onPresetChange(event.target.value as PresetKey)}
        >
          <option value="narrow">Narrow lognormal</option>
          <option value="transitional">Transitional lognormal</option>
          <option value="wide">Wide lognormal</option>
          <option value="multiplicative">Multiplicative growth</option>
        </select>
      </label>

      <label>
        Mode
        <select value={config.mode} onChange={updateMode}>
          <option value="direct">Direct lognormal</option>
          <option value="multiplicative">Multiplicative growth</option>
        </select>
      </label>

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
