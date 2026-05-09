import { FormulaBlock } from "./FormulaBlock";
import { LogIntervalStrip } from "./LogIntervalStrip";
import { WrappedNormalVisual } from "./WrappedNormalVisual";

export function ExplainerPage() {
  return (
    <section className="explainer-page" aria-labelledby="explainer-title">
      <div className="intro-band">
        <p className="eyebrow">The missing condition</p>
        <h2 id="explainer-title">Why Benford Happens</h2>
        <p>
          Benford's Law is not triggered just because data looks natural or
          lognormal. The bridge is the fractional part of the base-10 log.
        </p>
      </div>

      <article className="math-step">
        <h3>Split a number into scale and significand</h3>
        <p>
          For any positive number, separate its order of magnitude from its
          position inside that magnitude.
        </p>
        <FormulaBlock>X = 10^K * M, where 1 &lt;= M &lt; 10</FormulaBlock>
        <FormulaBlock>log10(X) = K + log10(M)</FormulaBlock>
        <p>
          Example: 3140 = 10^3 * 3.14, so log10(3140) is about 3 + log10(3.14)
          = 3.497. The fractional part, 0.497, tells us where the number sits
          inside its order of magnitude.
        </p>
      </article>

      <article className="math-step">
        <h3>Turn first digits into log intervals</h3>
        <p>
          The first digit is j when j &lt;= M &lt; j + 1. On the log scale,
          that becomes an interval for log10(M).
        </p>
        <FormulaBlock>
          P(D = j) = log10(j + 1) - log10(j) = log10((j + 1) / j)
        </FormulaBlock>
        <LogIntervalStrip />
      </article>

      <article className="math-step">
        <h3>Products become sums</h3>
        <p>
          Multiplicative growth moves into additive log space. With many
          independent factors, the central limit theorem explains why log10(X)
          often looks approximately Normal.
        </p>
        <FormulaBlock>X = A1 A2 ... An</FormulaBlock>
        <FormulaBlock>log10(X) = log10(A1) + ... + log10(An)</FormulaBlock>
      </article>

      <article className="math-step">
        <h3>Wrap the Normal around one order of magnitude</h3>
        <p>
          Benford needs the wrapped fractional log to be nearly uniform. For Z =
          log10(X), each fractional position r collects Normal-density mass
          from r, 1 + r, 2 + r, and all the shifted copies.
        </p>
        <FormulaBlock label="Wrapped density">
          f_{"{Z}"}(r) = sum_k f_Z(k + r)
        </FormulaBlock>
        <WrappedNormalVisual />
        <p>
          A narrow Normal such as Z ~ N(3.2, 0.01) stays bunched near 0.2 after
          wrapping. A wide Normal such as Z ~ N(3.2, 100) changes slowly over a
          distance of 1, so wrapped sums at 0.2 and 0.7 become nearly the same.
        </p>
      </article>

      <article className="math-step">
        <h3>Wide is an approximation, not a guarantee</h3>
        <p>
          Wide log distributions make Benford-like behavior plausible, but the
          direct diagnostic is still the fractional-log histogram. Simulated
          Benford emergence is not a fraud detector or a universal test for real
          datasets; real data can be shaped by truncation, rounding, assignment,
          selection effects, and reporting thresholds.
        </p>
      </article>
    </section>
  );
}
