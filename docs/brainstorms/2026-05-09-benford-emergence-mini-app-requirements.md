---
date: 2026-05-09
topic: benford-emergence-mini-app
---

# Benford Emergence Mini App

## Problem Frame

Users often hear that Benford's Law appears in naturally occurring numbers, but the usual explanation skips the key condition: a lognormal-looking dataset is not automatically Benford. The app should make the causal chain visible and interactive so math-curious learners, students, and data-literate users can see when Benford behavior appears, when it fails, and why wide distributions in log space make the difference.

The primary teaching frame is **Benford emergence from wide log distributions**, not scale invariance. Unit conversion can appear as a supporting diagnostic, but it should not drive the narrative.

```mermaid
flowchart TB
  A["Multiplicative process"] --> B["Logs turn products into sums"]
  B --> C["log10(X) becomes approximately Normal"]
  C --> D{"Is the log distribution wide enough?"}
  D -- "No" --> E["Fractional logs stay bunched"]
  E --> F["First digits are not Benford"]
  D -- "Yes" --> G["Fractional logs become nearly Uniform(0,1)"]
  G --> H["First digits become Benford-like"]
```

## Requirements

**Explainer Page**
- R1. Provide a math-first explainer page titled around Benford's Law from multiplicative growth.
- R2. Start from the decomposition for positive values: `X = 10^K * M`, where `K` is an integer and `1 <= M < 10`. Use this to show that `log10(X) = K + log10(M)`.
- R3. Show that `log10(M)` lies in `[0, 1)` and is exactly the fractional part `{log10(X)}`. Use an example like `3140 = 10^3 * 3.14` and `log10(3140) ~= 3 + log10(3.14) = 3.497`.
- R4. Explain that the first digit is `j` when `j <= M < j + 1`, equivalently `log10(j) <= log10(M) < log10(j + 1)`.
- R5. Derive the Benford probability from the uniform fractional-log assumption: if `{log10(X)}` is uniform on `[0, 1)`, then `P(D = j) = log10(j + 1) - log10(j) = log10((j + 1) / j)`.
- R6. Visualize first-digit intervals on the fractional log scale from `0` to `1`, including that digit `1` occupies `[0, log10(2))` and therefore has probability about `30.1%` when fractional logs are uniform.
- R7. Explain the multiplicative-to-additive transformation: `X = A1 A2 ... An` becomes `log10(X) = log10(A1) + ... + log10(An)`, making the connection to approximately Normal logs through the CLT.
- R8. Explicitly teach the missing step: Benford requires fractional logs `{log10(X)}` to be approximately uniform, not merely that `log10(X)` is approximately Normal.
- R9. Teach the wrapped-density idea for `Z = log10(X)`: for `0 <= r < 1`, the density of `{Z}` is the sum of Normal-density contributions at `r`, `1 + r`, `2 + r`, and so on, expressed conceptually as `f_{ {Z} }(r) = sum_k f_Z(k + r)`.
- R10. Contrast a narrow Normal, such as `Z ~ N(3.2, 0.01)`, whose fractional parts stay bunched near `0.2`, with a wide Normal, such as `Z ~ N(3.2, 100)`, whose mass spans many unit intervals that fold onto `[0, 1)`.
- R11. Explain why the wrapped wide Normal becomes nearly flat: when the Normal changes slowly over a distance of `1`, the sums at fractional positions like `0.2` and `0.7` are nearly the same.
- R12. Include a side-by-side or stepwise visual showing a narrow Normal log distribution with bunched fractional logs, a wider Normal with more even fractional logs, and the resulting first-digit distribution becoming more Benford-like.
- R13. End the explainer with the takeaway that Benford appears when values are spread broadly enough across logarithmic scale for fractional logs to become nearly uniform.
- R14. Frame "wide enough" as an approximate educational condition, not a deterministic threshold. The explainer should note that finite samples can still deviate from Benford even when the theoretical wrapped log distribution is close to uniform.
- R15. Include a short real-world caveat: simulated Benford emergence is not a fraud detector or universal test for real datasets; real data still needs domain checks for truncation, rounding, assigned numbers, selection effects, and reporting thresholds.

**Simulation Lab**
- R16. Provide a simulation lab where users can experiment with two first-version modes: direct lognormal simulation and multiplicative growth simulation.
- R17. In direct lognormal mode, let users control `mu`, `sigma`, and sample size for `Z ~ Normal(mu, sigma^2)` and `X = 10^Z`.
- R18. In multiplicative growth mode, each sample should start at `X0` and multiply by independent positive factors `Gt` where `log10(Gt) ~ Normal(growth_mean, growth_volatility^2)`. Let users control starting value, number of multiplicative steps, growth mean, growth volatility, and sample size.
- R19. The multiplicative growth mode should state its modeling assumptions: independent positive growth factors with finite variance, parameterized in log10 space. It should avoid implying that every multiplicative process becomes Benford-like.
- R20. For each simulation, show `log10(X)`, fractional logs `{log10(X)}`, and first-digit frequencies versus Benford probabilities.
- R21. Make the "wide Normal" effect discoverable: increasing `sigma`, multiplicative steps, or growth volatility should visibly flatten fractional logs and reduce distance from Benford.
- R22. Include one lightweight counterexample preset or note showing that high `SD(log10 X)` is not sufficient by itself if fractional logs remain structured rather than uniform.
- R23. Label sampled diagnostics as noisy estimates, include a way to rerun or reseed the simulation, and avoid presenting one random sample as proof of convergence.

**Diagnostics and Guidance**
- R24. Display `SD(log10 X)` as the primary numeric readiness signal, while treating the fractional-log histogram as the central visual diagnostic.
- R25. Use approximate log-width bands or labeled presets for narrow, transitional, and wide cases so the "why this sample is or is not Benford" explanation does not invent hidden thresholds.
- R26. Display a distance-from-Benford metric, such as absolute error sum or RMSE between simulated first-digit frequencies and Benford probabilities.
- R27. Treat the fractional-log histogram as the most direct diagnostic: if it is flat, first digits should be close to Benford; if it is bunched or patterned, they should not.
- R28. Provide a "why this sample is or is not Benford" explanation that interprets the current simulation in terms of log-width, fractional-log uniformity, sampling noise, and first-digit error.

**Experience**
- R29. Use a two-page interactive explainer structure: a conceptual "Why Benford Happens" page and a "Simulation Lab" page.
- R30. Structure the explainer as a linear learning sequence: positive-number decomposition, log split, first-digit intervals, products-to-sums, wrapped narrow-versus-wide Normal distributions, then the final takeaway.
- R31. Structure the lab around the fractional-log histogram and first-digit comparison as the primary charts, with controls grouped beside or above the charts depending on viewport width.
- R32. Provide a guided happy path through defaults or presets: start narrow, increase `sigma` or multiplicative width, observe fractional logs flatten, then compare first digits with Benford probabilities.
- R33. Keep the app usable without a backend; simulations should run locally in the browser.
- R34. Prioritize visual clarity over exhaustive statistical controls. The app should help users develop intuition, not behave like a full statistics package.
- R35. Make default settings produce a useful contrast between non-Benford and Benford-like outcomes without requiring users to tune every control first.
- R36. Define responsive and accessibility expectations during planning: charts must remain readable on small screens, controls must be keyboard and touch usable, color should not be the only encoding, and chart text or summaries should explain the same conclusion shown visually.

## Success Criteria

- A user can explain that first digits are determined by the fractional part of `log10(X)`.
- A user can see that a Normal distribution in log space is not sufficient by itself; the log distribution must be wide enough for fractional logs to become nearly uniform.
- A user can make Benford-like behavior appear by increasing lognormal `sigma` or by increasing multiplicative steps or volatility.
- A user can make the app show non-Benford behavior with narrow log distributions.
- Given a new simulated or described dataset, a user can predict whether Benford-like first digits should appear by checking log-width and fractional-log uniformity, rather than relying on whether the data sounds natural or lognormal.
- The first-digit chart, fractional-log histogram, and log-width metric tell a coherent story in the provided default and preset scenarios, with sampling noise called out when it affects the visual result.

## Scope Boundaries

- Do not present scale invariance as the central teaching frame.
- Do not build a backend, persistence, accounts, data upload, or sharing workflow for the first version.
- Do not try to prove a theorem rigorously; use correct math, but optimize for intuition and interaction.
- Do not include every possible data-generating process. Direct lognormal and multiplicative growth are the core simulations.
- Do not require external datasets for the initial app.
- Do not include additive-versus-multiplicative comparison or unit conversion in the first version unless the core emergence loop is already complete and these additions do not dilute the main learning goal.

## Key Decisions

- Primary frame: Benford emergence from wide log distributions. This matches the desired learning goal better than a first-digit-only or scale-invariance-first framing.
- Core simulations: direct lognormal and multiplicative growth. Together they show both the condition for Benford and where that condition can come from.
- Diagnostic hierarchy: `SD(log10 X)` is the primary numeric readiness signal, but fractional logs `{log10(X)}` are the central visual diagnostic. This avoids replacing the scale-invariance misconception with an SD-only misconception.
- First-version scope: additive comparison and unit conversion are deferred. They are useful context, but emphasizing them early would distract from the wide-Normal learning goal.

## Dependencies / Assumptions

- The repository currently appears empty aside from this brainstorm document, so the app is assumed to be net new.
- The implementation workflow should follow the repo instruction to use red-green test-driven development when writing code.
- A lightweight browser app is sufficient for the first version.

## Outstanding Questions

### Resolve Before Planning

- None.

### Deferred to Planning

- [Affects R25][Technical] Choose the approximate log-width bands or presets for narrow, transitional, and wide cases.
- [Affects R26][Technical] Choose the exact distance-from-Benford metric and visual labeling.
- [Affects R32][Design] Choose the specific default narrow and wide scenarios used in the guided happy path.
- [Affects R17-R18][Design / Technical] Define numeric input bounds, reset behavior, and whether simulations update live, on debounce, or through an explicit run button.
- [Affects R23][Technical] Decide whether to use random reruns, seed controls, or both for explaining sampling noise.
- [Affects R36][Design] Define responsive chart stacking, keyboard navigation, and accessible chart summaries.
- [Deferred enhancement] Consider additive-versus-multiplicative comparison only after the core direct-lognormal and multiplicative-growth loop is complete, and word it narrowly as a comparison against simple additive increments around a fixed scale.
- [Deferred enhancement] Consider a simple unit-conversion diagnostic only after the core emergence loop is polished, and only if it does not shift the teaching frame toward scale invariance.

## Next Steps

-> `/ce:plan` for structured implementation planning.
