import { FormulaBlock } from "./FormulaBlock";
import { BenfordPmfChart } from "./charts/BenfordPmfChart";

const scenarios = [
  {
    title: "Populations and city sizes",
    body: "City populations run from hamlets of a few hundred to megacities of tens of millions. That range creates an opportunity for Benford-like digits, depending on how the populations are sampled."
  },
  {
    title: "River lengths",
    body: "River lengths can be candidates for Benford's Law when a sample mixes short creeks with much longer rivers. Their actual digit pattern still needs to be checked."
  },
  {
    title: "Transaction and accounting amounts",
    body: "Ledgers combine tiny incidental charges with large capital movements. Blending many naturally scaled processes spreads the values across several orders of magnitude."
  },
  {
    title: "Scientific measurements",
    body: "Physical constants and measured quantities can span an enormous range of magnitudes. Depending on which quantities are collected, their first digits may show Benford's decreasing shape."
  },
  {
    title: "Market and economic quantities",
    body: "Company valuations, prices, and market caps stretch from small firms to trillion-dollar giants. Some collections may show Benford's Law, while pricing and selection rules can change the pattern."
  }
];

export function WhatIsBenfordPage() {
  return (
    <section className="what-page" aria-labelledby="what-title">
      <div className="intro-band">
        <h2 id="what-title">What is Benford's Law?</h2>
        <p>
          Benford's Law describes a pattern in some datasets: 1 appears as the
          first digit about 30% of the time, while 9 appears less than 5% of
          the time.
        </p>
      </div>

      <div className="what-grid">
        <article className="definition-panel">
          <h3>First digits are not evenly distributed</h3>
          <p>
            Under Benford's Law, digit 1 is most common and digit 9 is least
            common. These probabilities are not uniform over digits.
          </p>
          <p>
            Here, the first digit means the first nonzero digit of a positive
            number: 3140 has first digit 3, 0.0314 has first digit 3, and 10
            has first digit 1. Zero has no first nonzero digit; this applet
            considers positive values.
          </p>
          <FormulaBlock
            label="Benford PMF"
            formula={String.raw`P(D=d)=\log_{10}\left(\frac{d+1}{d}\right),\quad d=1,\ldots,9`}
            accessibilityLabel="Benford probability mass function formula"
          />
          <FormulaBlock
            label="Digit one"
            formula={String.raw`P(D=1)=\log_{10}(2)-\log_{10}(1)=\log_{10}(2)\approx0.301`}
            accessibilityLabel="Probability of first digit one is log base ten of two, about 0.301"
          />
          <p className="stat-callout">
            About <strong>30.1%</strong> of Benford values begin with 1.
          </p>
        </article>

        <BenfordPmfChart />
      </div>

      <article className="comparison-band">
        <div>
          <h3>Uniform first-digit intuition</h3>
          <p>
            A tempting guess is that each digit from 1 through 9 should appear
            about 11.1% of the time.
          </p>
        </div>
        <div>
          <h3>Benford shape</h3>
          <p>
            Benford's Law is tilted toward smaller leading digits. This
            decreasing shape is the visual signature to compare against.
          </p>
        </div>
      </article>

      <article className="scenario-section">
        <h3>Common real-world candidates</h3>
        <p>
          These are not guaranteed Benford datasets. They are contexts where
          Benford-like behavior is often encountered when values span orders of
          magnitude and are not heavily rounded, bounded, assigned, or filtered.
        </p>
        <div className="scenario-grid">
          {scenarios.map((scenario) => (
            <div className="scenario-card" key={scenario.title}>
              <h4>{scenario.title}</h4>
              <p>{scenario.body}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
