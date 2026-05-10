import { useState } from "react";
import { ExplainerPage } from "../components/ExplainerPage";
import { SimulationLab } from "../components/SimulationLab";
import { WhatIsBenfordPage } from "../components/WhatIsBenfordPage";

type Page = "what" | "why" | "simulations";

export function App() {
  const [page, setPage] = useState<Page>("what");

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Interactive probability applet</p>
          <h1>Benford Emergence Lab</h1>
        </div>
        <nav className="page-tabs" aria-label="Primary pages">
          <button
            type="button"
            className={page === "what" ? "active" : ""}
            aria-pressed={page === "what"}
            onClick={() => setPage("what")}
          >
            What is Benford's Law?
          </button>
          <button
            type="button"
            className={page === "why" ? "active" : ""}
            aria-pressed={page === "why"}
            onClick={() => setPage("why")}
          >
            Why it Happens
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
      </header>

      <main>
        {page === "what" ? <WhatIsBenfordPage /> : null}
        {page === "why" ? <ExplainerPage /> : null}
        {page === "simulations" ? <SimulationLab /> : null}
      </main>
    </div>
  );
}
