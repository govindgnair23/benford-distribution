import { FormulaBlock } from "./FormulaBlock";
import { WrapAnimation } from "./WrapAnimation";
import { WrappedNormalVisual } from "./WrappedNormalVisual";

export function MultiplicativeMechanism() {
  return (
    <section className="explainer-phase" aria-labelledby="multiplicative-mechanism-title">
      <header className="explainer-phase-header">
        <h3 id="multiplicative-mechanism-title">When fractional logs become nearly uniform</h3>
        <p>
          Here we use a Normal distribution of log values to illustrate one route
          to nearly uniform fractional logs. Multiplicative processes can produce
          approximately Normal logs under suitable conditions, but neither
          multiplication nor Normality is required for Benford’s Law.
        </p>
      </header>

      <article className="math-step">
        <h3>1. Products become sums</h3>
        <div>
          <p>
            Start with X₀ = 1. At each step, multiply by a new factor drawn uniformly
            between 0.9 and 1.1, independently of all previous draws. For example,
            one run might begin 1 × 1.08 × 0.94 × 1.03. Repeat the process with fresh
            independent draws to obtain a distribution of final values.
          </p>
          <FormulaBlock
            formula={String.raw`X_n=X_0\,A_1A_2\cdots A_n`}
            accessibilityLabel="Value as a product of independent factors"
          />
          <FormulaBlock
            formula={String.raw`\log_{10}(X_n)=\log_{10}(X_0)+\log_{10}(A_1)+\cdots+\log_{10}(A_n)`}
            accessibilityLabel="Log value as a sum of log factors"
          />
          <p>
            Taking logs turns each product into a sum. In this example, the log
            factors are independent, identically distributed, and have finite,
            nonzero variance. As the number of factors increases, the spread of the
            log values across repeated runs grows, and the central limit theorem
            motivates an approximately Normal model for their distribution.
          </p>
          <p>
            The central limit theorem explains the Normal approximation; it does
            not by itself establish uniform fractional logs. The next step shows
            what happens as a Normal log distribution becomes wider. Normality is not required
            for Benford’s Law—this is one illustrative route.
          </p>
        </div>
      </article>

      <article className="math-step">
        <h3>2. A wider Normal log distribution gives nearly uniform fractional logs</h3>
        <div>
          <p>
            We show the density at ten fractional positions: 0.0, 0.1, …, 0.9.
            Similar heights illustrate a nearly flat distribution; uniformity means
            the density is constant across the entire interval. The animation adds
            density at matching positions—for example, …, 1.2, 2.2, 3.2, … all
            contribute at fractional position 0.2.
          </p>
        </div>
        <WrapAnimation />
        <details className="wrap-details">
          <summary>See the math and density comparison</summary>
          <p>
            For Z = log₁₀(X), the wrapped density at fractional position r
            adds the Normal density at k + r for every integer k.
          </p>
          <FormulaBlock
            label="Wrapped density"
            formula={String.raw`f_{\{Z\}}(r)=\sum_{k\in\mathbb{Z}} f_Z(k+r)`}
            accessibilityLabel="Wrapped density formula"
          />
          <p>
            The sum is over all integer values of k. To calculate the wrapped
            density at 0.2, sum the densities at ..., -2.8, -1.8, -0.8, 0.2,
            1.2, 2.2, 3.2, ... . These all have fractional part 0.2, where
            fractional part means x − ⌊x⌋, so the fractional part of -2.8 is
            -2.8 - (-3) = 0.2.
          </p>
          <WrappedNormalVisual />
          <p className="wrap-conclusion">
            For the narrow Normal, the wrapped density at 0.2 and 0.7 looks very
            different, while for the wide Normal, the wrapped densities look much
            closer. In the former case, {"{log₁₀(X)}"}, the fractional part of
            log₁₀(X), does not appear uniform; in the latter case, it approaches a
            uniform distribution.
          </p>
        </details>
      </article>

      <article className="math-step">
        <h3 id="wide-range-title">A wide range alone is not enough</h3>
        <p>
          <strong>
            If the log-transformed values span a wide range, meaning the original
            values cover multiple orders of magnitude, Benford-like behavior
            becomes plausible.
          </strong>{" "}
          The direct diagnostic is whether the fractional-log histogram is
          approaching uniform. Simulated Benford emergence is not a
          fraud detector or a universal test for real datasets; real data can be
          shaped by truncation, rounding, assignment, selection effects, and
          reporting thresholds. For example, powers of 10 span many orders of
          magnitude, yet every one has first digit 1.
        </p>
      </article>
    </section>
  );
}
