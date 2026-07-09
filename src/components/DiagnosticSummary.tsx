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
        <span>SD(log₁₀ X)</span>
        <strong>{diagnostics.logWidth.toFixed(2)}</strong>
        <small className="metric-note">
          Standard deviation of log₁₀(X). Larger means a wider log distribution,
          closer to Benford.
        </small>
      </div>
      <div>
        <span>Width class</span>
        <strong>{diagnostics.widthLabel}</strong>
      </div>
      <div>
        <span>Distance from Benford</span>
        <strong>
          {diagnostics.benfordRmse.toFixed(3)}
          <small> RMSE</small>
        </strong>
        <small className="metric-note">
          Root-mean-square error of observed vs Benford first-digit
          probabilities. 0 means exactly Benford.
        </small>
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
