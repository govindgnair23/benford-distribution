export interface HistogramOptions {
  binCount: number;
  min: number;
  max: number;
}

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
}

export function histogram(
  values: number[],
  { binCount, min, max }: HistogramOptions
): HistogramBin[] {
  if (!Number.isInteger(binCount) || binCount <= 0) {
    throw new Error("binCount must be a positive integer");
  }
  if (!(max > min)) {
    throw new Error("max must be greater than min");
  }

  const width = (max - min) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => ({
    start: min + index * width,
    end: min + (index + 1) * width,
    count: 0
  }));

  for (const value of values) {
    if (!Number.isFinite(value) || value < min || value > max) {
      continue;
    }

    const index =
      value === max
        ? binCount - 1
        : Math.min(binCount - 1, Math.floor((value - min) / width));
    bins[index].count += 1;
  }

  return bins;
}
