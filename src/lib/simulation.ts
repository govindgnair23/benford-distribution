import { firstDigitFromLog10, fractionalPart } from "./benford";
import { createSeededRandom, normalRandom } from "./random";

export interface SimulatedSample {
  logSamples: number[];
  fractionalLogs: number[];
  firstDigits: number[];
  logWidth: number;
}

export interface DirectLognormalConfig {
  mu: number;
  sigma: number;
  sampleSize: number;
  seed: number;
}

export interface MultiplicativeGrowthConfig {
  log10Start: number;
  growthMean: number;
  growthVolatility: number;
  steps: number;
  sampleSize: number;
  seed: number;
}

export function simulateDirectLognormal(
  config: DirectLognormalConfig
): SimulatedSample {
  validateSampleSize(config.sampleSize);
  validateNonNegative(config.sigma, "sigma");

  const random = createSeededRandom(config.seed);
  const logSamples = Array.from(
    { length: config.sampleSize },
    () => config.mu + config.sigma * normalRandom(random)
  );

  return summarizeLogSamples(logSamples);
}

export function simulateMultiplicativeGrowth(
  config: MultiplicativeGrowthConfig
): SimulatedSample {
  validateSampleSize(config.sampleSize);
  validateNonNegative(config.growthVolatility, "growthVolatility");
  if (!Number.isInteger(config.steps) || config.steps < 0) {
    throw new Error("steps must be a non-negative integer");
  }

  const random = createSeededRandom(config.seed);
  const logSamples = Array.from({ length: config.sampleSize }, () => {
    let logValue = config.log10Start;
    for (let step = 0; step < config.steps; step += 1) {
      logValue +=
        config.growthMean + config.growthVolatility * normalRandom(random);
    }
    return logValue;
  });

  return summarizeLogSamples(logSamples);
}

export function summarizeLogSamples(logSamples: number[]): SimulatedSample {
  const fractionalLogs = logSamples.map(fractionalPart);
  const firstDigits = logSamples.map(firstDigitFromLog10);

  return {
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
