import { useMemo, useState } from "react";

import {
  benfordVerdict,
  defaultAddVsMultiplyConfig,
  simulateAddVsMultiply,
  type BenfordVerdict,
  type ProcessStep
} from "../lib/addVsMultiply";
import { benfordProbability } from "../lib/benford";

// Towns start at 100,000 residents. Adding: 0–200 newcomers per decade.
// Percentage growth: each decade the population changes by up to ±30%. A
// symmetric ±30% change shrinks towns slightly on average, so the start is high
// enough that the smallest towns after 200 decades still have dozens of people.
const townConfig = {
  ...defaultAddVsMultiplyConfig,
  startValue: 100_000,
  addAmount: 100
};

const TOWN_COUNT = townConfig.sampleSize;
const durationPresets = [1, 10, 50, 200];

type ProcessKey = "add" | "multiply";

const verdictText: Record<BenfordVerdict, string> = {
  close: "Close to Benford",
  closer: "Getting closer",
  far: "Not Benford"
};

function formatPopulation(logValue: number) {
  const people = 10 ** logValue;
  const rounded = people < 100 ? Math.round(people) : Number(people.toPrecision(3));
  return rounded.toLocaleString("en-US");
}

function DigitBars({ summary, name }: { summary: ProcessStep; name: string }) {
  const shares = summary.firstDigitShares;
  const scaleTop = Math.max(0.35, ...shares) * 1.08;
  return (
    <div
      className="avm-digits"
      role="img"
      aria-label={`${name} first digits: ${shares
        .map((share, index) => `${index + 1}: ${(share * 100).toFixed(1)}% vs Benford ${(benfordProbability(index + 1) * 100).toFixed(1)}%`)
        .join("; ")}`}
    >
      {shares.map((share, index) => (
        <div className="avm-digit" key={index} aria-hidden="true">
          <span className="avm-digit-value">{share === 1 ? "100" : (share * 100).toFixed(1)}</span>
          <div className="avm-digit-column">
            <div className="avm-digit-bar" style={{ height: `${(share / scaleTop) * 100}%` }} />
            <div className="avm-digit-benford" style={{ bottom: `${(benfordProbability(index + 1) / scaleTop) * 100}%` }} />
          </div>
          <span className="avm-digit-label">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

interface GrowthPanelProps {
  kind: ProcessKey;
  title: string;
  rule: string;
  summary: ProcessStep;
}

function GrowthPanel({ kind, title, rule, summary }: GrowthPanelProps) {
  const verdict = benfordVerdict(summary.benfordRmse, TOWN_COUNT);
  const titleId = `avm-${kind}-title`;
  return (
    <section className={`avm-process avm-${kind}`} aria-labelledby={titleId}>
      <header>
        <h4 id={titleId}>{title}</h4>
        <p className="avm-rule">{rule}</p>
      </header>
      <div className="avm-verdict">
        <span className={`avm-pill is-${verdict}`}>{verdictText[verdict]}</span>
      </div>
      <div className="avm-legend">
        <span><i className="avm-swatch-process" />Share of towns (%)</span>
        <span><i className="avm-swatch-benford" />Benford</span>
      </div>
      <DigitBars summary={summary} name={title} />
      <p className="avm-chart-note">
        Towns range from about {formatPopulation(summary.lowerLog)} to{" "}
        {formatPopulation(summary.upperLog)} people (middle 95%).
      </p>
    </section>
  );
}

export function AddVsMultiplyLab() {
  const [decades, setDecades] = useState(durationPresets.at(-1)!);
  const run = useMemo(() => simulateAddVsMultiply(townConfig), []);

  return (
    <section className="avm-lab" aria-labelledby="avm-title">
      <div className="avm-intro">
        <p className="eyebrow">Try it yourself</p>
        <h3 id="avm-title">Exercise: Which kind of town growth spreads populations across many orders of magnitude?</h3>
        <p>
          {TOWN_COUNT.toLocaleString("en-US")} towns start with{" "}
          {townConfig.startValue.toLocaleString("en-US")} residents each. Pick how long
          they grow and compare the first digits of their populations. This is a
          simplified model, not a forecast of real cities.
        </p>
      </div>

      <div className="wrap-animation-switch avm-presets" role="group" aria-label="Decades of growth">
        {durationPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            aria-pressed={decades === preset}
            onClick={() => setDecades(preset)}
          >
            {preset === 1 ? "1 decade" : `${preset} decades`}
          </button>
        ))}
      </div>

      <div className="avm-duel">
        <GrowthPanel
          kind="add"
          title="Adding newcomers"
          rule={`Each decade, every town gains between 0 and ${2 * townConfig.addAmount} people, whatever its size.`}
          summary={run.add.steps[decades]}
        />
        <GrowthPanel
          kind="multiply"
          title="Percentage growth"
          rule={`Each decade, every town grows or shrinks by up to ${Math.round(townConfig.multiplyRange * 100)}%, in proportion to its size.`}
          summary={run.multiply.steps[decades]}
        />
      </div>

      <p className="avm-takeaway" data-testid="growth-takeaway" aria-live="polite">
        After {decades} {decades === 1 ? "decade" : "decades"} in this simulation, percentage-growth digits are{" "}
        {benfordVerdict(run.multiply.steps[decades].benfordRmse, TOWN_COUNT) === "close"
          ? "close to Benford."
          : benfordVerdict(run.multiply.steps[decades].benfordRmse, TOWN_COUNT) === "closer"
            ? "getting closer to Benford."
            : "still far from Benford."}
        {" "}Adding similar numbers of newcomers keeps populations clustered.
      </p>
    </section>
  );
}
