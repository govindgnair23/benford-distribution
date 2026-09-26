import { AddVsMultiplyLab } from "./AddVsMultiplyLab";
import { MultiplicativeMechanism } from "./MultiplicativeMechanism";

export function SimulationLab() {
  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <h2 id="lab-title">Why it happens</h2>
        <p>
          “How it works” showed that Benford follows when fractional logs are nearly
          uniform, and that this happens when values span many orders of magnitude.
          This page explains why a wide spread makes fractional logs uniform, then lets
          you test what kind of growth produces that spread.
        </p>
      </div>

      <MultiplicativeMechanism />

      <AddVsMultiplyLab />
    </section>
  );
}
