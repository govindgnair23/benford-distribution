import { FormulaBlock } from "./FormulaBlock";
import { LogIntervalStrip } from "./LogIntervalStrip";
import { WrapAnimation } from "./WrapAnimation";
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

      <section className="explainer-phase" aria-labelledby="benford-condition-title">
        <header className="explainer-phase-header">
          <p className="eyebrow">Steps 1–3</p>
          <h3 id="benford-condition-title">What Benford Requires</h3>
          <p>
            These steps identify the mathematical condition: the fractional
            parts of log₁₀(X) must be approximately uniform.
          </p>
        </header>

        <article className="math-step">
          <h3>Step 1 — Prerequisites</h3>
          <p>
            This argument only uses positive values. Start with scientific
            notation: 3140 = 3.14 × 10³. The power of ten, 10³, is the order of
            magnitude. The 3.14 is the significand, and its first digit is 3.
            Since log₁₀(10³) = 3, base-10 logs turn powers of ten into ordinary
            exponents.
          </p>
          <FormulaBlock
            formula={String.raw`3140=3.14\times10^3`}
            accessibilityLabel="Scientific notation example, 3140 equals 3.14 times ten cubed"
          />
          <p>
            One piece of notation recurs below: curly braces denote the fractional
            part of a number, {"{x}"} = x − ⌊x⌋, the part left after subtracting
            the integer floor ⌊x⌋.
          </p>
          <FormulaBlock
            label="Fractional part"
            formula={String.raw`\{x\}=x-\lfloor x\rfloor`}
            accessibilityLabel="Fractional part definition, curly x equals x minus floor of x"
          />
        </article>

        <article className="math-step">
          <h3>Step 2 — Split a number into scale and significand</h3>
          <p>
            For any positive number, separate its order of magnitude (K) from its
            significand (M). For X = 3140, K = 3 and M = 3.14.
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
            Because K is an integer and 0 ≤ log₁₀(M) &lt; 1, K is the integer
            part of log₁₀(X), while log₁₀(M) is its fractional part. Therefore,
            the fractional part of log₁₀(X) is log₁₀(M).
          </p>
          <FormulaBlock
            label="Fractional-log identity"
            formula={String.raw`\{\log_{10}(X)\}=\log_{10}(M)`}
            accessibilityLabel="Fractional part of log base ten X equals log base ten M"
          />
        </article>

        <article className="math-step log-interval-step">
          <h3>Step 3 — Turn first digits into log intervals</h3>
          <div className="formula-explanation-pairs">
            <FormulaBlock
              label="From Step 2"
              formula={String.raw`X=10^K M\quad\Longrightarrow\quad D=k\iff k\le M<k+1`}
              accessibilityLabel="Significand determines the first digit formula"
            />
            <div>
              <p>
                In other words, the first digit D is k when the significand M
                is between k and k + 1. For example, 3.14 × 10³ has
                significand M = 3.14. Because 3 ≤ 3.14 &lt; 4, its first digit
                is 3.
              </p>
              <p className="digit-shift-note">
                <strong>Note:</strong> Multiplying M by 10ᴷ shifts its decimal
                point without changing its first digit.
              </p>
            </div>
            <p>
              Now let X represent a randomly selected value from the dataset, and
              let D be its first digit. The notation P(D = k) means the probability
              that the selected value's first digit is k. The statement above says
              this is the same event as M landing between k and k + 1.
            </p>
            <FormulaBlock
              label="The same event"
              formula={String.raw`P(D=k)=P(k\le M<k+1)`}
              accessibilityLabel="First-digit event written as a probability"
            />
            <FormulaBlock
              label="Move to the log scale"
              formula={String.raw`P(k\le M<k+1)=P\!\left(\log_{10}(k)\le\log_{10}(M)<\log_{10}(k+1)\right)`}
              accessibilityLabel="First-digit event translated to the log scale"
            />
            <p>
              Because log₁₀ is increasing, taking logs preserves the order of the
              endpoints. The condition k ≤ M &lt; k + 1 is therefore equivalent to
              log₁₀(k) ≤ log₁₀(M) &lt; log₁₀(k + 1).
            </p>
            <p>
              Step 2 defined 1 ≤ M &lt; 10, so taking base-10 logs places log₁₀(M)
              in [0, 1): 0 ≤ log₁₀(M) &lt; 1. That range alone does not imply
              Benford's Law. Benford requires log₁₀(M) to be approximately uniform
              across [0, 1), not merely confined to it. For a uniform variable,
              the probability of landing in an interval equals its length.
              Subtracting the lower endpoint from the upper endpoint produces the
              Benford probability.
            </p>
            <FormulaBlock
              label="Uniform interval length"
              formula={String.raw`P(D=k)=\log_{10}(k+1)-\log_{10}(k)=\log_{10}\left(\frac{k+1}{k}\right)`}
              accessibilityLabel="Benford digit interval probability formula"
            />
            <FormulaBlock
              label="D = 3 example"
              formula={String.raw`P(D=3)=\log_{10}(4)-\log_{10}(3)=\log_{10}\left(\frac{4}{3}\right)`}
              accessibilityLabel="First digit three interval example"
            />
            <p>
              Setting k = 3 gives log₁₀(4) − log₁₀(3) ≈ 0.125. Under the uniform
              log condition, about 12.5 percent of values have first digit 3. This
              is one value in the probability mass function of the Benford
              Distribution.
            </p>
          </div>
          <LogIntervalStrip />
          <p className="key-requirement">
            The key requirement is that log₁₀(M), or equivalently {"{log₁₀(X)}"},
            the fractional part of log₁₀(X), is approximately uniform.
          </p>
        </article>
      </section>

      <section className="explainer-phase" aria-labelledby="multiplicative-mechanism-title">
        <header className="explainer-phase-header">
          <p className="eyebrow">Steps 4–5</p>
          <h3 id="multiplicative-mechanism-title">
            How Multiplicative Processes Can Produce It
          </h3>
          <p>
            These steps explain one way products of many factors can make the
            required fractional-log distribution nearly uniform.
          </p>
        </header>

        <article className="math-step">
          <h3>Step 4 — Products become sums</h3>
          <p>
            Multiplicative growth moves into additive log space. With many
            independent factors and suitable conditions on their logs, the
            central limit theorem can make log₁₀(X) approximately Normal.
            Normality is not required for Benford's Law; we use a Normal model
            here to illustrate how fractional logs can approach uniformity.
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
          <h3>Step 5 — Add up the density at each fractional value</h3>
          <p>
            Step 3 showed that Benford requires the fractional part of log₁₀(X)
            to be nearly uniform. Step 4 introduced a roughly Normal model for
            log₁₀(X). For each fractional value 0.1, 0.2, …, 1.0, add up the Normal’s
            density at every point with that fractional part: for 0.2, that is 2.2,
            3.2, 4.2, and so on. If the ten totals are equal, the fractional part
            is uniform. A narrow Normal gives very unequal totals. A wide Normal, where X spans
            several orders of magnitude, gives totals close to 1.
          </p>
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
          <h3>Wide is an approximation, not a guarantee</h3>
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
    </section>
  );
}
