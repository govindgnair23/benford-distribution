import { FormulaBlock } from "./FormulaBlock";
import { WrapAnimation } from "./WrapAnimation";
import { WrappedNormalVisual } from "./WrappedNormalVisual";

export function MultiplicativeMechanism() {
  return (
    <section className="explainer-phase" aria-labelledby="multiplicative-mechanism-title">
      <header className="explainer-phase-header">
        <h3 id="multiplicative-mechanism-title">Why fractional logs become uniform</h3>
        <p>
          Two steps explain it. Multiplying many factors turns into adding logs, which
          spreads log values across many orders of magnitude. A wide spread then makes
          the fractional parts of those logs nearly uniform.
        </p>
      </header>

      <article className="math-step">
        <h3>1. Products become sums</h3>
        <div>
          <p>
            Think of a city that grows by a percentage each decade: +12% in one decade,
            −4% in the next, +20% after that. Its population is its starting size times
            a string of growth factors, so its log is a sum of many small random
            amounts. Cities that start at the same size drift apart on the log scale,
            and the spread keeps growing decade after decade.
          </p>
          <FormulaBlock
            formula={String.raw`P_n=P_0\,(1+g_1)(1+g_2)\cdots(1+g_n)`}
            accessibilityLabel="Population as a product of growth factors"
          />
          <FormulaBlock
            formula={String.raw`\log_{10}(P_n)=\log_{10}(P_0)+\log_{10}(1+g_1)+\cdots+\log_{10}(1+g_n)`}
            accessibilityLabel="Log population as a sum"
          />
          <p>
            With many independent factors and suitable conditions on their logs, the
            central limit theorem can make the log population approximately Normal,
            with a spread that grows with the number of factors. Normality is not required
            for Benford's Law; we use a Normal model here to illustrate how
            fractional logs can approach uniformity. Census population counts are a
            classic real-world example: they span from villages to megacities, and
            their first digits follow Benford's Law closely.
          </p>
        </div>
      </article>

      <article className="math-step">
        <h3>2. A wide spread makes fractional logs nearly uniform</h3>
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
