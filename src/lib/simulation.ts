import { firstDigitFromLog10, fractionalPart } from "./benford";
import { createSeededRandom, normalRandom } from "./random";

export interface SimulatedSample {
  values: number[];
  logSamples: number[];
  fractionalLogs: number[];
  firstDigits: number[];
  logWidth: number;
}

export interface OriginalNormalConfig {
  mean: number;
  standardDeviation: number;
  sampleSize: number;
  seed: number;
}

export interface MultiplicativeGrowthConfig {
  startValue: number;
  growthFactorMean: number;
  growthFactorVolatility: number;
  steps: number;
  sampleSize: number;
  seed: number;
}

export function simulateOriginalNormal(
  config: OriginalNormalConfig
): SimulatedSample {
  validateSampleSize(config.sampleSize);
  validatePositive(config.mean, "mean");
  validateNonNegative(config.standardDeviation, "standardDeviation");

  const random = createSeededRandom(config.seed);
  const values = positiveNormalSamples({
    mean: config.mean,
    standardDeviation: config.standardDeviation,
    sampleSize: config.sampleSize,
    random
  });
  const logSamples = values.map((value) => Math.log10(value));

  return summarizeSamples(values, logSamples);
}

export function simulateMultiplicativeGrowth(
  config: MultiplicativeGrowthConfig
): SimulatedSample {
  validateSampleSize(config.sampleSize);
  validatePositive(config.startValue, "startValue");
  validatePositive(config.growthFactorMean, "growthFactorMean");
  validateNonNegative(
    config.growthFactorVolatility,
    "growthFactorVolatility"
  );
  if (!Number.isInteger(config.steps) || config.steps < 0) {
    throw new Error("steps must be a non-negative integer");
  }

  const random = createSeededRandom(config.seed);
  const logSamples = Array.from({ length: config.sampleSize }, () => {
    let logValue = Math.log10(config.startValue);
    for (let step = 0; step < config.steps; step += 1) {
      const factor = positiveNormalSample({
        mean: config.growthFactorMean,
        standardDeviation: config.growthFactorVolatility,
        random
      });
      logValue += Math.log10(factor);
    }
    return logValue;
  });
  const values = logSamples.map(valueFromLog10);

  return summarizeSamples(values, logSamples);
}

export function summarizeLogSamples(logSamples: number[]): SimulatedSample {
  return summarizeSamples(logSamples.map(valueFromLog10), logSamples);
}

function summarizeSamples(values: number[], logSamples: number[]): SimulatedSample {
  const fractionalLogs = logSamples.map(fractionalPart);
  const firstDigits = logSamples.map(firstDigitFromLog10);

  return {
    values,
    logSamples,
    fractionalLogs,
    firstDigits,
    logWidth: standardDeviation(logSamples)
  };
}

export function standardDeviation(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
}

function positiveNormalSamples({
  mean,
  standardDeviation,
  sampleSize,
  random
}: {
  mean: number;
  standardDeviation: number;
  sampleSize: number;
  random: () => number;
}) {
  return Array.from({ length: sampleSize }, () =>
    positiveNormalSample({ mean, standardDeviation, random })
  );
}

function positiveNormalSample({
  mean,
  standardDeviation,
  random
}: {
  mean: number;
  standardDeviation: number;
  random: () => number;
}) {
  if (standardDeviation === 0) {
    return mean;
  }

  for (let attempt = 0; attempt < 10000; attempt += 1) {
    const value = mean + standardDeviation * normalRandom(random);
    if (value > 0) {
      return value;
    }
  }

  throw new Error("Unable to draw a positive Normal sample");
}

function validateSampleSize(sampleSize: number) {
  if (!Number.isInteger(sampleSize) || sampleSize <= 0) {
    throw new Error("sampleSize must be a positive integer");
  }
}

function validateNonNegative(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative finite number`);
  }
}

function validatePositive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be positive`);
  }
}

function valueFromLog10(logValue: number) {
  if (logValue > 308) {
    return Number.MAX_VALUE;
  }
  return 10 ** logValue;
}
