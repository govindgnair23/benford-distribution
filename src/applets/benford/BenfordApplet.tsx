import { useState } from "react";

import { ExplainerPage } from "../../components/ExplainerPage";
import { SimulationLab } from "../../components/SimulationLab";
import { WhatIsBenfordPage } from "../../components/WhatIsBenfordPage";

type BenfordPage = "what" | "why" | "simulations";

export function BenfordApplet() {
  const [page, setPage] = useState<BenfordPage>("what");

  return (
    <section aria-labelledby="benford-applet-title">
      <div className="applet-heading">
        <div>
          <p className="eyebrow">Interactive probability applet</p>
          <h2 id="benford-applet-title">Benford Emergence Lab</h2>
        </div>
        <nav className="page-tabs" aria-label="Benford applet pages">
          <button
            type="button"
            className={page === "what" ? "active" : ""}
            aria-pressed={page === "what"}
            onClick={() => setPage("what")}
          >
            What it is
          </button>
          <button
            type="button"
            className={page === "why" ? "active" : ""}
            aria-pressed={page === "why"}
            onClick={() => setPage("why")}
          >
            Why it happens
          </button>
          <button
            type="button"
            className={page === "simulations" ? "active" : ""}
            aria-pressed={page === "simulations"}
            onClick={() => setPage("simulations")}
          >
            Simulations
          </button>
        </nav>
      </div>

      {page === "what" ? <WhatIsBenfordPage /> : null}
      {page === "why" ? <ExplainerPage /> : null}
      {page === "simulations" ? <SimulationLab /> : null}
    </section>
  );
}
