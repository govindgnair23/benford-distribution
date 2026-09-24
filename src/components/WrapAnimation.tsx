import { useEffect, useRef, useState } from "react";

import { wrappedDensityProfile } from "../lib/wrappedNormal";

const profiles = {
  narrow: wrappedDensityProfile({
    mean: 3.2,
    standardDeviation: 0.1,
    minShift: 2,
    maxShift: 4,
    step: 0.05
  }).slice(0, -1),
  wide: wrappedDensityProfile({
    mean: 3.2,
    standardDeviation: 10,
    minShift: -40,
    maxShift: 40,
    step: 0.05
  }).slice(0, -1)
};

type Profile = keyof typeof profiles;

export function WrapAnimation() {
  const [wrapped, setWrapped] = useState(false);
  const [profile, setProfile] = useState<Profile>("narrow");
  const replayTimer = useRef<number | null>(null);
  const values = profiles[profile];
  const peak = Math.max(...values.map((point) => point.density));

  useEffect(() => () => {
    if (replayTimer.current !== null) window.clearTimeout(replayTimer.current);
  }, []);

  function playWrap() {
    if (replayTimer.current !== null) window.clearTimeout(replayTimer.current);
    if (wrapped) {
      setWrapped(false);
      replayTimer.current = window.setTimeout(() => {
        setWrapped(true);
        replayTimer.current = null;
      }, 100);
    } else {
      setWrapped(true);
    }
  }

  return (
    <section className="wrap-animation" aria-label="Interactive wrapping demonstration">
      <div className="wrap-animation-heading">
        <div>
          <p className="eyebrow">Watch the wrap</p>
          <h4>Whole-number shifts meet at the same position</h4>
        </div>
        <button className="secondary-action" type="button" onClick={playWrap}>
          {wrapped ? "Replay wrap" : "Wrap values"}
        </button>
      </div>
      <div
        className="wrap-animation-stage"
        data-stage={wrapped ? "after" : "before"}
        role="img"
        aria-label="2.2, 3.2, and 4.2 all wrap to the same fractional position, 0.2"
      >
        <p className="wrap-animation-source-label">Log value, log₁₀(X)</p>
        <div className="wrap-animation-source" aria-hidden="true">
          <span>2</span><span>3</span><span>4</span><span>5</span>
        </div>
        <div className="wrap-animation-dots" aria-hidden="true">
          <span>2.2</span><span>3.2</span><span>4.2</span>
        </div>
        <div className="wrap-animation-target" aria-hidden="true">
          <span>0</span><strong>0.2</strong><span>1</span>
        </div>
      </div>
      <div className="wrap-animation-compare">
        <h5>Wrapped density shape</h5>
        <div className="wrap-animation-switch" aria-label="Compare wrapped distributions">
          <button type="button" aria-pressed={profile === "narrow"} onClick={() => setProfile("narrow")}>Narrow Normal</button>
          <button type="button" aria-pressed={profile === "wide"} onClick={() => setProfile("wide")}>Wide Normal</button>
        </div>
        <div className="wrap-animation-profile" role="img" aria-label={`${profile} wrapped density across fractional positions`}>
          {values.map((point) => (
            <span
              key={point.residue}
              style={{ height: `${Math.max(2, (point.density / peak) * 100)}%` }}
            />
          ))}
        </div>
        <div className="wrap-animation-axis" aria-hidden="true"><span>0</span><span>Fractional position</span><span>1</span></div>
        <p className="wrap-animation-result" aria-live="polite">
          {profile === "narrow"
            ? "Narrow: density gathers near 0.2, so the wrapped shape is uneven."
            : "Wide: density spreads across the interval, so the wrapped shape is closer to uniform."}
        </p>
        <p className="wrap-animation-scale-note">Bars show relative density; each shape is scaled to its own peak.</p>
      </div>
    </section>
  );
}
