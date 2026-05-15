import type { SampleDiagnostics } from "../lib/diagnostics";

interface DiagnosticSummaryProps {
  diagnostics: SampleDiagnostics;
  sampleSize: number;
  seed: number;
}

export function DiagnosticSummary({
  diagnostics,
  sampleSize,
  seed
}: DiagnosticSummaryProps) {
  return (
    <aside className="diagnostic-summary" aria-label="Simulation diagnostics">
      <div>
        <span>SD(log10 X)</span>
        <strong title="Standard deviation of log10(X). Larger = wider log distribution = closer to Benford.">
          {diagnostics.logWidth.toFixed(2)}
        </strong>
      </div>
      <div>
        <span>Width class</span>
        <strong>{diagnostics.widthLabel}</strong>
      </div>
      <div>
        <span>Distance from Benford</span>
        <strong title="Root mean squared error of observed vs Benford first-digit probabilities. 0 = exactly Benford.">
          {diagnostics.benfordRmse.toFixed(3)}
          <small> RMSE</small>
        </strong>
      </div>
      <div>
        <span>Sample size</span>
        <strong>{sampleSize.toLocaleString()}</strong>
      </div>
      <p className="diagnostic-explanation">
        {diagnostics.explanation}{" "}
        <span className="seed-readout">
          Seed <strong data-testid="seed-value">{seed}</strong>
        </span>
      </p>
    </aside>
  );
}
