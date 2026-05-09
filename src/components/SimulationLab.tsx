import { useMemo, useState } from "react";

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

export function SimulationLab() {
  const [config, setConfig] = useState<LabConfig>(() => clonePreset("narrow"));

  const sample = useMemo(() => {
    if (config.mode === "direct") {
      return simulateDirectLognormal(config.direct);
    }
    return simulateMultiplicativeGrowth(config.multiplicative);
  }, [config]);

  const diagnostics = useMemo(() => evaluateSample(sample), [sample]);
  const activeConfig =
    config.mode === "direct" ? config.direct : config.multiplicative;

  function handlePresetChange(preset: PresetKey) {
    setConfig(clonePreset(preset));
  }

  function handleRerun() {
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
  }

  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <p className="eyebrow">Make Benford appear</p>
        <h2 id="lab-title">Simulation Lab</h2>
        <p>
          Adjust log width and watch fractional logs move from bunched to flat,
          then compare first digits against Benford probabilities.
        </p>
      </div>

      <div className="lab-layout">
        <SimulationControls
          config={config}
          onChange={setConfig}
          onPresetChange={handlePresetChange}
          onRerun={handleRerun}
        />
        <DiagnosticSummary
          diagnostics={diagnostics}
          sampleSize={activeConfig.sampleSize}
          seed={activeConfig.seed}
        />
      </div>
      <div className="chart-grid">
        <FractionalLogHistogram values={sample.fractionalLogs} />
        <FirstDigitChart firstDigits={sample.firstDigits} />
        <LogHistogram values={sample.logSamples} />
      </div>
    </section>
  );
}
