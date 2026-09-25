import { FormulaBlock } from "./FormulaBlock";
import { LogIntervalStrip } from "./LogIntervalStrip";
import { WrapAnimation } from "./WrapAnimation";
import { WrappedNormalVisual } from "./WrappedNormalVisual";

export function ExplainerPage() {
  return (
    <section className="explainer-page" aria-labelledby="explainer-title">
      <div className="intro-band">
        <h2 id="explainer-title">Why Benford Happens</h2>
        <p>
          Follow one number onto the fractional-log scale, then see how a
          nearly uniform distribution on that scale produces Benford probabilities.
        </p>
      </div>

      <section className="explainer-phase" aria-labelledby="benford-condition-title">
        <header className="explainer-phase-header">
          <h3 id="benford-condition-title">From a number to its first digit</h3>
          <p>
            Taking a base-10 log separates scale from the digits. Keeping its
            fractional part puts values from different scales onto the same interval.
          </p>
        </header>

        <article className="definition-panel" aria-label="Worked example from 3140 to first digit 3">
          <h3>Follow 3140</h3>
          <ol className="worked-example">
            <li><strong>Original value: 3140.</strong> Write it as 3.14 × 10³.</li>
            <li><strong>Base-10 log: approximately 3.497.</strong> The integer 3 records the scale.</li>
            <li><strong>Fractional part: approximately 0.497.</strong> Subtract the floor of the log value.</li>
            <li><strong>First digit: 3.</strong> The position 0.497 lies between log₁₀(3) ≈ 0.477 and log₁₀(4) ≈ 0.602.</li>
          </ol>
          <p>
            Each digit occupies an interval below. If fractional logs are uniform on [0, 1),
            a digit's probability equals its interval's length. Digit 3 occupies about 12.5% of that interval.
          </p>
        </article>
        <LogIntervalStrip />
        <details className="wrap-details derivation-details">
          <summary>Show the derivation</summary>
          <article className="math-step">
            <h3>Separate a number’s digits from its scale</h3>
            <p>
              This argument only uses positive values. Start with scientific
              notation: 3140 = 3.14 × 10³. The factor 10³ sets the scale. The 3.14 is the significand, and its first digit is 3.
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
            <h3>Write the general form</h3>
            <p>
              For any positive number, separate its scale exponent (K) from its
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
              Because K is an integer and 0 ≤ log₁₀(M) &lt; 1, K is the floor
              of log₁₀(X), while log₁₀(M) is its fractional part. Therefore,
              the fractional part of log₁₀(X) is log₁₀(M).
            </p>
            <FormulaBlock
              label="Fractional-log identity"
              formula={String.raw`\{\log_{10}(X)\}=\log_{10}(M)`}
              accessibilityLabel="Fractional part of log base ten X equals log base ten M"
            />
          </article>

          <article className="math-step log-interval-step">
            <h3>Turn first digits into log intervals</h3>
            <div className="formula-explanation-pairs">
              <FormulaBlock
                label="The digit interval"
                formula={String.raw`X=10^K M\quad\Longrightarrow\quad D=d\iff d\le M<d+1`}
                accessibilityLabel="Significand determines the first digit formula"
              />
              <div>
                <p>
                  In other words, the first digit D is d when the significand M
                  is between d and d + 1. For example, 3.14 × 10³ has
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
                let D be its first digit. The notation P(D = d) means the probability
                that the selected value's first digit is d. The statement above says
                this is the same event as M landing between d and d + 1.
              </p>
              <FormulaBlock
                label="The same event"
                formula={String.raw`P(D=d)=P(d\le M<d+1)`}
                accessibilityLabel="First-digit event written as a probability"
              />
              <FormulaBlock
                label="Move to the log scale"
                formula={String.raw`P(d\le M<d+1)=P\!\left(\log_{10}(d)\le\log_{10}(M)<\log_{10}(d+1)\right)`}
                accessibilityLabel="First-digit event translated to the log scale"
              />
              <p>
                Because log₁₀ is increasing, taking logs preserves the order of the
                endpoints. The condition d ≤ M &lt; d + 1 is therefore equivalent to
                log₁₀(d) ≤ log₁₀(M) &lt; log₁₀(d + 1).
              </p>
              <p>
                The significand satisfies 1 ≤ M &lt; 10, so taking base-10 logs places log₁₀(M)
                in [0, 1): 0 ≤ log₁₀(M) &lt; 1. That range alone does not imply
                Benford's Law. Uniformity across [0, 1) gives Benford probabilities;
                merely lying in that range does not. For a uniform variable,
                the probability of landing in an interval equals its length.
                Subtracting the lower endpoint from the upper endpoint produces the
                Benford probability.
              </p>
              <FormulaBlock
                label="Uniform interval length"
                formula={String.raw`P(D=d)=\log_{10}(d+1)-\log_{10}(d)=\log_{10}\left(\frac{d+1}{d}\right)`}
                accessibilityLabel="Benford digit interval probability formula"
              />
              <FormulaBlock
                label="D = 3 example"
                formula={String.raw`P(D=3)=\log_{10}(4)-\log_{10}(3)=\log_{10}\left(\frac{4}{3}\right)`}
                accessibilityLabel="First digit three interval example"
              />
              <p>
                Setting d = 3 gives log₁₀(4) − log₁₀(3) ≈ 0.125. Under the uniform
                log condition, about 12.5 percent of values have first digit 3. This
                is one value in the probability mass function of the Benford
                Distribution.
              </p>
            </div>
            <p className="key-requirement">
              Benford probabilities follow when log₁₀(M), or equivalently {"{log₁₀(X)}"},
              the fractional part of log₁₀(X), is approximately uniform.
            </p>
          </article>
        </details>
      </section>

      <section className="explainer-phase" aria-labelledby="multiplicative-mechanism-title">
        <header className="explainer-phase-header">
          <h3 id="multiplicative-mechanism-title">
            How Multiplicative Processes Can Produce It
          </h3>
          <p>
            These steps explain one way products of many factors can make the
            required fractional-log distribution nearly uniform.
          </p>
        </header>

        <article className="math-step">
          <h3>Products become sums</h3>
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
          <h3>Combine matching fractional positions</h3>
          <p>
            We show the density at ten fractional positions: 0.0, 0.1, …, 0.9.
            Similar heights illustrate a nearly flat distribution; uniformity means
            the density is constant across the entire interval. The animation adds
            density at matching positions—for example, …, 1.2, 2.2, 3.2, … all
            contribute at fractional position 0.2.
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
    </section>
  );
}
