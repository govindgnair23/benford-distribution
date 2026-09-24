import {
  expectedBenfordSamplingRmse,
  type SampleDiagnostics
} from "../lib/diagnostics";

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
  const samplingRmse = expectedBenfordSamplingRmse(sampleSize);

  return (
    <aside className="diagnostic-summary" aria-label="Simulation diagnostics">
      <div>
        <span>SD(log₁₀ X)</span>
        <strong>{diagnostics.logWidth.toFixed(2)}</strong>
        <small className="metric-note">
          Standard deviation of log₁₀(X). Larger means a wider log distribution;
          use the digit chart and RMSE to judge this sample's match.
        </small>
      </div>
      <div>
        <span>Width class</span>
        <strong>{diagnostics.widthLabel}</strong>
        <small className="metric-note">
          Teaching category based on log spread. Transitional samples can
          already match Benford digits closely; this label does not measure fit.
        </small>
      </div>
      <div>
        <span>Distance from Benford</span>
        <strong>
          {diagnostics.benfordRmse.toFixed(3)}
          <small> RMSE</small>
        </strong>
        <small className="metric-note">
          {(diagnostics.benfordRmse * 100).toFixed(1)} percentage points across
          the nine first-digit probabilities.
        </small>
        <small className="metric-note">
          Root-mean-square error of observed vs Benford first-digit
          probabilities. Typical sampling-only RMSE at this sample size is about{" "}
          {samplingRmse.toFixed(3)} ({(samplingRmse * 100).toFixed(1)} percentage
          points). This is a reference scale, not a pass/fail test.
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
