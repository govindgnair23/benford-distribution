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

export function LogIntervalStrip() {
  return (
    <div className="interval-module">
      <div
        className="interval-strip"
        role="img"
        aria-label="First digit intervals on the fractional log scale. Digit 1 has the largest interval at about 30.1 percent."
      >
        {intervals.map((interval) => (
          <div
            className="interval-segment"
            key={interval.digit}
            style={{ flexGrow: interval.probability }}
          >
            <span>D={interval.digit}</span>
            <small>{(interval.probability * 100).toFixed(1)}%</small>
          </div>
        ))}
      </div>
      <p className="chart-summary">
        Digit 1 has the largest interval: [0, log10(2)), about 30.1% of
        the unit interval.
      </p>
    </div>
  );
}
