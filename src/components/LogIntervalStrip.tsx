import { benfordProbability } from "../lib/benford";

const intervals = Array.from({ length: 9 }, (_, index) => {
  const digit = index + 1;
  return {
    digit,
    start: Math.log10(digit),
    end: Math.log10(digit + 1),
    probability: benfordProbability(digit)
  };
});

// Segments below this share of the unit interval are too thin to hold a legible
// percentage; their values move to the legend row beneath the strip.
const INLINE_LABEL_MIN = 0.06;

export function LogIntervalStrip() {
  const compactIntervals = intervals.filter(
    (interval) => interval.probability < INLINE_LABEL_MIN
  );

  return (
    <div className="interval-module">
      <div
        className="interval-strip"
        role="img"
        aria-label="First digit intervals on the fractional log scale. Digit 1 has the largest interval at about 30.1 percent, and digits 7, 8, and 9 have the smallest at about 5.8, 5.1, and 4.6 percent."
      >
        {intervals.map((interval) => (
          <div
            className="interval-segment"
            key={interval.digit}
            style={{ flexGrow: interval.probability }}
          >
            <span>D={interval.digit}</span>
            {interval.probability >= INLINE_LABEL_MIN ? (
              <small>{(interval.probability * 100).toFixed(1)}%</small>
            ) : null}
          </div>
        ))}
      </div>
      {compactIntervals.length > 0 ? (
        <ul className="interval-legend">
          {compactIntervals.map((interval) => (
            <li key={interval.digit}>
              D={interval.digit} · {(interval.probability * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
      ) : null}
      <p className="chart-summary">
        Digit 1 has the largest interval: [0, log10(2)), about 30.1% of
        the unit interval.
      </p>
    </div>
  );
}
