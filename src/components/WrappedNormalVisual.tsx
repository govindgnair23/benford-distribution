export function WrappedNormalVisual() {
  return (
    <div className="wrap-visual" aria-label="Narrow and wide normal wrapping comparison">
      <div>
        <h4>Narrow Normal</h4>
        <div className="curve narrow" aria-hidden="true" />
        <p>Fractional parts stay bunched near the original center.</p>
      </div>
      <div>
        <h4>Wide Normal</h4>
        <div className="curve wide" aria-hidden="true" />
        <p>Many unit intervals fold together, making the wrapped density flatter.</p>
      </div>
    </div>
  );
}
