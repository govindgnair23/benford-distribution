import { AddVsMultiplyLab } from "./AddVsMultiplyLab";
import { MultiplicativeMechanism } from "./MultiplicativeMechanism";

export function SimulationLab() {
  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <h2 id="lab-title">Why it happens</h2>
        <p>
          “How it works” established that nearly uniform fractional logs give
          Benford probabilities. Here we illustrate how values spanning many orders
          of magnitude can produce nearly uniform fractional logs.
        </p>
      </div>

      <MultiplicativeMechanism />

      <AddVsMultiplyLab />
    </section>
  );
}
