import { useState } from "react";
import { ExplainerPage } from "../components/ExplainerPage";
import { SimulationLab } from "../components/SimulationLab";

type Page = "explainer" | "lab";

export function App() {
  const [page, setPage] = useState<Page>("explainer");

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
            className={page === "explainer" ? "active" : ""}
            aria-pressed={page === "explainer"}
            onClick={() => setPage("explainer")}
          >
            Why Benford Happens
          </button>
          <button
            type="button"
            className={page === "lab" ? "active" : ""}
            aria-pressed={page === "lab"}
            onClick={() => setPage("lab")}
          >
            Simulation Lab
          </button>
        </nav>
      </header>

      <main>
        {page === "explainer" ? <ExplainerPage /> : <SimulationLab />}
      </main>
    </div>
  );
}
