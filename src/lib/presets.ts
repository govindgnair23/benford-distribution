export type SimulationMode = "direct" | "multiplicative";
export type PresetKey = "narrow" | "transitional" | "wide" | "multiplicative";

export interface DirectConfig {
  mean: number;
  standardDeviation: number;
  sampleSize: number;
  seed: number;
}

export interface MultiplicativeConfig {
  startValue: number;
  growthFactorMean: number;
  growthFactorVolatility: number;
  steps: number;
  sampleSize: number;
  seed: number;
}

export interface LabConfig {
  mode: SimulationMode;
  preset: PresetKey;
  direct: DirectConfig;
  multiplicative: MultiplicativeConfig;
}

const baseDirect: DirectConfig = {
  mean: 1000,
  standardDeviation: 80,
  sampleSize: 5000,
  seed: 22
};

const baseMultiplicative: MultiplicativeConfig = {
  startValue: 100,
  growthFactorMean: 1,
  growthFactorVolatility: 0.18,
  steps: 60,
  sampleSize: 5000,
  seed: 22
};

export const presets: Record<PresetKey, LabConfig> = {
  narrow: {
    mode: "direct",
    preset: "narrow",
    direct: { ...baseDirect, standardDeviation: 80 },
    multiplicative: { ...baseMultiplicative }
  },
  transitional: {
    mode: "direct",
    preset: "transitional",
    direct: { ...baseDirect, standardDeviation: 900 },
    multiplicative: { ...baseMultiplicative }
  },
  wide: {
    mode: "direct",
    preset: "wide",
    direct: { ...baseDirect, standardDeviation: 120000 },
    multiplicative: { ...baseMultiplicative }
  },
  multiplicative: {
    mode: "multiplicative",
    preset: "multiplicative",
    direct: { ...baseDirect, standardDeviation: 900 },
    multiplicative: { ...baseMultiplicative }
  }
};

export function clonePreset(key: PresetKey): LabConfig {
  return structuredClone(presets[key]);
}

export function nextSeed(seed: number): number {
  return seed + 1;
}
