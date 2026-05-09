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
        <strong>{diagnostics.logWidth.toFixed(2)}</strong>
      </div>
      <div>
        <span>Width label</span>
        <strong>{diagnostics.widthLabel}</strong>
      </div>
      <div>
        <span>Distance from Benford</span>
        <strong>{diagnostics.benfordRmse.toFixed(3)} RMSE</strong>
      </div>
      <div>
        <span>Sample</span>
        <strong>{sampleSize.toLocaleString()}</strong>
      </div>
      <p data-testid="seed-value">Seed {seed}</p>
      <p>{diagnostics.explanation}</p>
    </aside>
  );
}
