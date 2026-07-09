import { useMemo, useState, useTransition } from "react";

import { evaluateSample } from "../lib/diagnostics";
import {
  clonePreset,
  nextSeed,
  type LabConfig,
  type PresetKey
} from "../lib/presets";
import {
  simulateDirectLognormal,
  simulateMultiplicativeGrowth
} from "../lib/simulation";
import { DiagnosticSummary } from "./DiagnosticSummary";
import { SimulationControls } from "./SimulationControls";
import { FirstDigitChart } from "./charts/FirstDigitChart";
import { FractionalLogHistogram } from "./charts/FractionalLogHistogram";
import { LogHistogram } from "./charts/LogHistogram";
import { OriginalValueHistogram } from "./charts/OriginalValueHistogram";

export function SimulationLab() {
  const [config, setConfig] = useState<LabConfig>(() => clonePreset("narrow"));
  const [isRegenerating, startRegen] = useTransition();

  const sample = useMemo(() => {
    if (config.mode === "direct") {
      return simulateDirectLognormal(config.direct);
    }
    return simulateMultiplicativeGrowth(config.multiplicative);
  }, [config]);

  const diagnostics = useMemo(() => evaluateSample(sample), [sample]);
  const activeConfig =
    config.mode === "direct" ? config.direct : config.multiplicative;

  // All config edits (typed values, slider drags, preset changes) route through
  // the transition so regenerating large samples never blocks per keystroke.
  function handleConfigChange(next: LabConfig) {
    startRegen(() => {
      setConfig(next);
    });
  }

  function handlePresetChange(preset: PresetKey) {
    startRegen(() => {
      setConfig(clonePreset(preset));
    });
  }

  function handleRerun() {
    startRegen(() => {
      setConfig((current) => {
        if (current.mode === "direct") {
          return {
            ...current,
            direct: {
              ...current.direct,
              seed: nextSeed(current.direct.seed)
            }
          };
        }

        return {
          ...current,
          multiplicative: {
            ...current.multiplicative,
            seed: nextSeed(current.multiplicative.seed)
          }
        };
      });
    });
  }

  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <p className="eyebrow">Make Benford appear</p>
        <h2 id="lab-title">Simulations</h2>
        <p>
          Adjust log width and watch fractional logs move from bunched to flat,
          then compare first digits against Benford probabilities.
        </p>
      </div>

      <div className="lab-layout">
        <SimulationControls
          config={config}
          onChange={handleConfigChange}
          onPresetChange={handlePresetChange}
          onRerun={handleRerun}
          isRegenerating={isRegenerating}
        />
        <DiagnosticSummary
          diagnostics={diagnostics}
          sampleSize={activeConfig.sampleSize}
          seed={activeConfig.seed}
        />
      </div>
      <p className="chart-grid-caption">
        Read the pipeline left to right: original values become their log₁₀,
        then the fractional part of each log, then the resulting first digits
        compared against Benford.
      </p>
      <div className="chart-grid">
        <OriginalValueHistogram values={sample.values} />
        <LogHistogram values={sample.logSamples} />
        <FractionalLogHistogram values={sample.fractionalLogs} />
        <FirstDigitChart firstDigits={sample.firstDigits} />
      </div>
    </section>
  );
}
