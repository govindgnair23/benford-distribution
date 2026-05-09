export type SimulationMode = "direct" | "multiplicative";
export type PresetKey = "narrow" | "transitional" | "wide" | "multiplicative";

export interface DirectConfig {
  mu: number;
  sigma: number;
  sampleSize: number;
  seed: number;
}

export interface MultiplicativeConfig {
  log10Start: number;
  growthMean: number;
  growthVolatility: number;
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
  mu: 3.2,
  sigma: 0.08,
  sampleSize: 5000,
  seed: 22
};

const baseMultiplicative: MultiplicativeConfig = {
  log10Start: 2,
  growthMean: 0,
  growthVolatility: 0.18,
  steps: 60,
  sampleSize: 5000,
  seed: 22
};

export const presets: Record<PresetKey, LabConfig> = {
  narrow: {
    mode: "direct",
    preset: "narrow",
    direct: { ...baseDirect, sigma: 0.08 },
    multiplicative: { ...baseMultiplicative }
  },
  transitional: {
    mode: "direct",
    preset: "transitional",
    direct: { ...baseDirect, sigma: 0.42 },
    multiplicative: { ...baseMultiplicative }
  },
  wide: {
    mode: "direct",
    preset: "wide",
    direct: { ...baseDirect, sigma: 2 },
    multiplicative: { ...baseMultiplicative }
  },
  multiplicative: {
    mode: "multiplicative",
    preset: "multiplicative",
    direct: { ...baseDirect, sigma: 0.42 },
    multiplicative: { ...baseMultiplicative }
  }
};

export function clonePreset(key: PresetKey): LabConfig {
  return structuredClone(presets[key]);
}

export function nextSeed(seed: number): number {
  return seed + 1;
}
