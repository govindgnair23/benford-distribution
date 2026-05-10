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
          lognormal. This page walks through the condition that actually
          matters.
        </p>
      </div>

      <article className="math-step">
        <h3>Prerequisites</h3>
        <p>
          This argument only uses positive values. Start with scientific
          notation: 3140 = 3.14 * 10^3. The power of ten, 10^3, is the order of
          magnitude. The 3.14 is the significand, and its first digit is 3.
          Since log10(10^3) = 3, base-10 logs turn powers of ten into ordinary
          exponents.
        </p>
        <FormulaBlock
          formula={String.raw`3140=3.14\times10^3`}
          accessibilityLabel="Scientific notation example, 3140 equals 3.14 times ten cubed"
        />
      </article>

      <article className="math-step">
        <h3>Split a number into scale and significand</h3>
        <p>
          For any positive number, separate its order of magnitude from its
          significand. For X = 3140, K = 3 and M = 3.14.
        </p>
        <div className="formula-stack">
          <FormulaBlock
            label="General form"
            formula={String.raw`X=10^K M,\quad 1\le M<10`}
            accessibilityLabel="Positive number decomposition formula"
          />
          <FormulaBlock
            label="Example"
            formula={String.raw`3140=10^3\times3.14`}
            accessibilityLabel="3140 equals ten cubed times 3.14"
          />
        </div>
        <div className="formula-stack">
          <FormulaBlock
            label="Take base-10 logs"
            formula={String.raw`\log_{10}(X)=K+\log_{10}(M)`}
            accessibilityLabel="Base ten log split into integer order and significand log"
          />
          <FormulaBlock
            label="Example"
            formula={String.raw`\log_{10}(3140)=3+\log_{10}(3.14)`}
            accessibilityLabel="Log base ten of 3140 equals 3 plus log base ten of 3.14"
          />
        </div>
        <p>
          Example: log10(3140) is about 3 + log10(3.14) = 3.497. The integer
          part is K = 3. The remaining decimal part, 0.497, is log10(M).
        </p>
      </article>

      <article className="math-step">
        <h3>Turn first digits into log intervals</h3>
        <p>
          The first digit is k when k &lt;= M &lt; k + 1. On the log scale, this
          becomes log10(k) &lt;= log10(M) &lt; log10(k + 1). If log10(M) is
          uniform on [0, 1), then the probability of each first digit is just
          the length of that interval.
        </p>
        <FormulaBlock
          formula={String.raw`P(D=k)=\log_{10}(k+1)-\log_{10}(k)=\log_{10}\left(\frac{k+1}{k}\right)`}
          accessibilityLabel="Benford digit interval probability formula"
        />
        <p>
          For the running example, M = 3.14, so D = 3 because 3 &lt;= 3.14 &lt;
          4.
        </p>
        <FormulaBlock
          label="D = 3 example"
          formula={String.raw`P(D=3)=\log_{10}(4)-\log_{10}(3)=\log_{10}\left(\frac{4}{3}\right)`}
          accessibilityLabel="First digit three interval example"
        />
        <LogIntervalStrip />
        <p>
          The key requirement is that log10(M), or equivalently {"{log10(X)}"},
          is approximately uniform.
        </p>
      </article>

      <article className="math-step">
        <h3>Products become sums</h3>
        <p>
          Multiplicative growth moves into additive log space. With many
          independent factors, the central limit theorem explains why log10(X)
          often looks approximately Normal.
        </p>
        <FormulaBlock
          formula={String.raw`X=A_1A_2\cdots A_n`}
          accessibilityLabel="Multiplicative process formula"
        />
        <FormulaBlock
          formula={String.raw`\log_{10}(X)=\log_{10}(A_1)+\cdots+\log_{10}(A_n)`}
          accessibilityLabel="Product becomes sum of logs formula"
        />
      </article>

      <article className="math-step">
        <h3>Wrap the Normal around one order of magnitude</h3>
        <p>
          Benford needs the wrapped fractional log to be nearly uniform. For Z =
          log10(X), each fractional position r collects Normal-density mass
          from r, 1 + r, 2 + r, and all the shifted copies.
        </p>
        <FormulaBlock
          label="Wrapped density"
          formula={String.raw`f_{\{Z\}}(r)=\sum_{k=-\infty}^{\infty} f_Z(k+r)`}
          accessibilityLabel="Wrapped density formula"
        />
        <WrappedNormalVisual />
        <p>
          A narrow Normal such as Z ~ N(3.2, 0.01) stays bunched near 0.2 after
          wrapping. A wide Normal such as Z ~ N(3.2, 100) changes slowly over a
          distance of 1, so wrapped sums at 0.2 and 0.7 become nearly the same.
          That is how a wide log distribution can make {"{log10(X)}"} nearly
          uniform, which is when Benford starts to appear.
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
