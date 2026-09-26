import { FormulaBlock } from "./FormulaBlock";
import { NumberMappingAnimation } from "./NumberMappingAnimation";

export function ExplainerPage() {
  return (
    <section className="explainer-page" aria-labelledby="explainer-title">
      <div className="intro-band">
        <h2 id="explainer-title">How it works</h2>
        <p>
          Follow a number onto the fractional-log scale, then see how nearly
          uniform fractional logs give Benford probabilities.
        </p>
      </div>

      <section id="benford-condition-title" className="explainer-phase" aria-labelledby="explainer-title">
        <NumberMappingAnimation />
        <details className="wrap-details derivation-details">
          <summary>Show the derivation</summary>
          <article className="math-step">
            <h3>Define the fractional part</h3>
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
              significand (M).
            </p>
            <div className="formula-stack">
              <FormulaBlock
                label="General form"
                formula={String.raw`X=10^K M,\quad 1\le M<10`}
                accessibilityLabel="Positive number decomposition formula"
              />
            </div>
            <div className="formula-stack">
              <FormulaBlock
                label="Take base-10 logs"
                formula={String.raw`\log_{10}(X)=K+\log_{10}(M)`}
                accessibilityLabel="Base ten log split into integer order and significand log"
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
                  is between d and d + 1.
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
