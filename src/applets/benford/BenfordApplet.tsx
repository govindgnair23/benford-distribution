import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { ExplainerPage } from "../../components/ExplainerPage";
import { SimulationLab } from "../../components/SimulationLab";
import { WhatIsBenfordPage } from "../../components/WhatIsBenfordPage";

type BenfordPage = "what" | "why" | "simulations";

const tabs: { id: BenfordPage; label: string }[] = [
  { id: "what", label: "What it is" },
  { id: "why", label: "Why it happens" },
  { id: "simulations", label: "Simulations" }
];

export function BenfordApplet() {
  const [page, setPage] = useState<BenfordPage>("what");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    const nextIndex = (index + tabs.length) % tabs.length;
    setPage(tabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(tabs.length - 1);
    }
  }

  return (
    <section aria-labelledby="benford-applet-title">
      <div className="applet-heading">
        <div>
          <p className="eyebrow">Interactive probability applet</p>
          <h2 id="benford-applet-title">Benford Emergence Lab</h2>
        </div>
        <nav
          className="page-tabs"
          role="tablist"
          aria-label="Benford applet pages"
        >
          {tabs.map((tab, index) => {
            const isActive = page === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`benford-tab-${tab.id}`}
                aria-controls={`benford-panel-${tab.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                className={isActive ? "active" : ""}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                onClick={() => setPage(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div
        role="tabpanel"
        id={`benford-panel-${page}`}
        aria-labelledby={`benford-tab-${page}`}
      >
        {page === "what" ? <WhatIsBenfordPage /> : null}
        {page === "why" ? <ExplainerPage /> : null}
        {page === "simulations" ? <SimulationLab /> : null}
      </div>
    </section>
  );
}
