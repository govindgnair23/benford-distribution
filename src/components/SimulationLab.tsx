import { AddVsMultiplyLab } from "./AddVsMultiplyLab";

export function SimulationLab() {
  return (
    <section className="lab-page" aria-labelledby="lab-title">
      <div className="lab-header">
        <h2 id="lab-title">Simulations</h2>
        <p>
          Compare additive and multiplicative processes, then inspect how log
          spread and fractional logs relate to first-digit frequencies.
        </p>
      </div>

      <AddVsMultiplyLab />
    </section>
  );
}
