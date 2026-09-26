import { AddVsMultiplyLab } from "./AddVsMultiplyLab";
import { MultiplicativeMechanism } from "./MultiplicativeMechanism";

export function SimulationLab() {
  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <h2 id="lab-title">Why it happens</h2>
        <p>
          “How it works” established that Benford probabilities arise when the fractional parts of logarithms are uniformly distributed, and noted that this condition is often met when values span multiple orders of magnitude. Here, we explain why spanning many orders of magnitude helps produce this uniformity.
        </p>
      </div>

      <MultiplicativeMechanism />

      <AddVsMultiplyLab />
    </section>
  );
}
