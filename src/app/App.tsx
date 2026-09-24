import { useMemo, useState } from "react";

import { availableApplets } from "./applets";

export function App() {
  const [selectedAppletId, setSelectedAppletId] = useState<string | null>(null);
  const selectedApplet = useMemo(
    () => availableApplets.find((applet) => applet.id === selectedAppletId),
    [selectedAppletId]
  );
  const SelectedApplet = selectedApplet?.component;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Interactive statistics applets</p>
          <h1>StatQuest</h1>
          <p className="topbar-summary">
            A growing library of compact labs for exploring statistics,
            probability, and data intuition.
          </p>
        </div>
        {selectedApplet ? (
          <button
            type="button"
            className="secondary-action"
            onClick={() => setSelectedAppletId(null)}
          >
            Back to applet library
          </button>
        ) : null}
      </header>

      <main>
        {SelectedApplet ? (
          <SelectedApplet />
        ) : (
          <section className="applet-catalog" aria-label="Applet catalog">
            <div className="applet-grid">
              {availableApplets.map((applet) => (
                <article className="applet-card" key={applet.id}>
                  <p className="applet-area">{applet.conceptArea}</p>
                  <h2>{applet.title}</h2>
                  <p>{applet.subtitle}</p>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => setSelectedAppletId(applet.id)}
                  >
                    Open {applet.title}
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
