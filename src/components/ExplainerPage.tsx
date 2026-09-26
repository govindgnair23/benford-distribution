import { FormulaBlock } from "./FormulaBlock";
import { NumberMappingAnimation } from "./NumberMappingAnimation";

export function ExplainerPage() {
  return (
    <section className="explainer-page" aria-labelledby="explainer-title">
      <div className="intro-band">
        <h2 id="explainer-title">How it works</h2>
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

        <NumberMappingAnimation />
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
    </section>
  );
}
