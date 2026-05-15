---
title: "feat: StatQuest design system (tokens + agent-readable doc)"
type: feat
status: active
date: 2026-05-15
origin: docs/brainstorms/2026-05-15-statquest-design-system-requirements.md
---

# StatQuest Design System

## Overview

Codify the existing StatQuest editorial visual language into (a) a set of semantically-named CSS custom properties on `:root` in `src/styles/global.css`, (b) a typed TypeScript palette module for Recharts consumers, and (c) an agent-readable design document at `docs/design-system.md` that future applets — distributions, CLT / hypothesis tests / CI, Bayesian, regression — can follow without re-deriving colors or inventing patterns. Visual output of the existing Benford applet is preserved exactly; the chart palette is *additively* expanded to cover an ordered 4-series, a translucent region fill, and a diverging pair.

## Problem Frame

`src/styles/global.css` and several `src/components/charts/*.tsx` files contain ~25 distinct hex literals expressing a coherent but undocumented visual system. Chart components inline their own series colors (`#1f3832`, `#238457`, `#2f66b1`, `#e6b85a`, `#6b7f78`, `#8a938e`, `#d24b2a`, `#8d3d25`), some of which drift from the canonical palette. Future applets need an ordered series palette, region fill, and diverging color that don't exist yet, and a coding agent given "add a CLT applet" today has no documented source of truth to reference. (See origin: `docs/brainstorms/2026-05-15-statquest-design-system-requirements.md`.)

## Requirements Trace

- **R1.** `docs/design-system.md` exists and documents principles, tokens, type/spacing scales, surfaces & borders, focus & motion, accessibility floor, and the canonical pattern catalog (Eyebrow, HeroBand/IntroBand, DefinitionPanel, ScenarioCard, MathStep, FormulaBlock, KeyRequirement, ChartFrame, PageTabs, SecondaryAction, ControlPanel, DiagnosticSummary).
- **R2.** All color, spacing, type, and border literals in `global.css` are extracted into `:root` custom properties with semantic names; existing rules reference the tokens.
- **R3.** Chart palette: ordered 4-series (color-blind-safe), region-fill token, diverging pair — each with documented roles.
- **R4.** Design doc contains a "How to add an applet" section telling agents which patterns to reuse and how to propose new tokens.
- **R5.** Accessibility floor (WCAG AA contrast, focus styling, reduced-motion stance) is documented and met.
- **R6.** Light-only; tokens are semantically named so a future dark theme is mechanical.

## Scope Boundaries

- No redesign of the current look.
- No CSS framework, no CSS modules, no styled-components — `global.css` stays the single stylesheet.
- No React primitive extraction (`<HeroBand>`, `<ChartFrame>` as components) in this round; patterns are documented by their CSS class hooks.
- No dark theme shipped.
- No graph/Markov primitives.
- No changes to test infrastructure or visual-regression tooling.

## Context & Research

### Relevant Code and Patterns

- `src/styles/global.css` — single stylesheet; ~813 lines; contains every layout, color, and type rule. The `:root` block at the top is where tokens will land.
- `src/components/charts/*.tsx` — five Recharts wrappers (`BenfordPmfChart`, `FirstDigitChart`, `FractionalLogHistogram`, `LogHistogram`, `OriginalValueHistogram`) plus `ChartFrame`. Series colors are passed as `stroke`/`fill` props with inline hex strings.
- `src/components/WrappedNormalVisual.tsx` — uses `#238457` and `#2f66b1` as the canonical "two example points" colors; the matching `.legend-swatch.point-two / .point-seven` classes in CSS hardcode the same values.
- `src/app/applets.ts` — applet registry; new applets must follow the same `AppletDefinition` shape and will pick up the global stylesheet automatically.
- `AGENTS.md`, `CLAUDE.md`, `README.md` — agent-instruction surfaces that should reference the new design doc.

### Institutional Learnings

- The Benford applet went through three iterations (`docs/plans/2026-05-09-001`, `-002`, `2026-05-10-001`) before settling on the current visual structure. The patterns enumerated in R1 are the empirical residue of those iterations; codifying them now prevents re-litigating the same decisions per applet.
- Tests in `src/**/*.test.tsx` assert on text, roles, and structure — not on color values — so a token refactor that preserves rendered hex values is unlikely to break tests. To verify during implementation.

### External References

- Okabe & Ito (2008), *Color Universal Design* — the de-facto categorical color-blind-safe palette. Used as the source of the proposed ordered-series colors. https://jfly.uni-koeln.de/color/

## Key Technical Decisions

- **Semantic token naming.** `--surface-canvas`, `--surface-card`, `--surface-sunken`, `--ink-strong`, `--ink-body`, `--ink-muted`, `--ink-on-accent`, `--accent-warm`, `--accent-warm-deep`, `--accent-warm-soft`, `--accent-deep`, `--border-hairline`, `--border-card`, `--border-input`. Avoid literal names (`--cream`, `--terracotta`) so a future dark theme can swap values without renaming references.
- **Chart palette duplicated in TypeScript.** Expose the chart subset as a typed `src/styles/tokens.ts` module (`chartPalette.series[0..3]`, `chartPalette.regionFill`, `chartPalette.diverging.positive/negative`, plus the small set of neutrals charts need: `axis`, `gridline`, `label`). Rationale: Recharts components consume colors as JS string props; reading `getComputedStyle(document.documentElement)` per render is fragile under SSR, test environments (`jsdom`), and the initial paint. CSS variables remain the visual source of truth; `tokens.ts` mirrors the *chart* subset only and is the single place to update those values.
- **Chart series palette derived from Okabe-Ito.** Series order: `#0072B2` (blue), `#D55E00` (vermillion), `#009E73` (bluish green), `#CC79A7` (reddish purple). All four are distinguishable under deuteranopia, protanopia, and tritanopia per Okabe & Ito's published simulations. Vermillion is intentionally close to the existing `--accent-warm` (`#d24b2a`) so the chart palette harmonizes with the editorial accent; bluish green is close to the existing `#238457` used in `WrappedNormalVisual`, allowing a one-step migration.
- **Region fill token.** `rgba(31, 56, 50, 0.14)` — a translucent forest-green tint that reads as "selected region" without competing with series colors, plus a warm variant `rgba(210, 75, 42, 0.14)` for rejection regions / Benford-style highlights.
- **Diverging pair.** Positive = `#0072B2`, Negative = `#D55E00` (the first two ordered-series colors). Reuses palette rather than introducing a third axis of color.
- **No primitive extraction this round.** Patterns are documented by their CSS class hooks (`.hero-panel`, `.definition-panel`, `.math-step`, `.chart-frame`, etc.). Component extraction is a future decision once a second applet stress-tests the patterns.
- **Doc location.** `docs/design-system.md` (top-level under `docs/`, not nested). Linked from `README.md`, `AGENTS.md`, and `CLAUDE.md`.
- **Spacing and type extracted as tokens too.** Repeated values (`1180px` page max-width; the `28px`/`22px`/`18px`/`14px` spacing rhythm; the `clamp()` headline scale) become tokens — not just colors. This is the cheapest way to prevent off-spec values appearing in new applets.

## Open Questions

### Resolved During Planning

- **Tokens-as-TS-constants vs CSS-var-read for Recharts?** TS constants in `src/styles/tokens.ts`, scoped to the chart subset. (See decision above.)
- **Color-blind verification of the chart palette?** Resolved by adopting Okabe-Ito directly — already verified by the source. Document the source in the design doc; no per-applet re-verification needed.
- **Design doc location?** `docs/design-system.md`.

### Deferred to Implementation

- **Exact contrast-audit results.** AA compliance for `--ink-muted (#3f4d48)` on `--surface-card (#fffaf1)` and on `--surface-canvas (#f6f1e8)` must be measured during Unit 4 and recorded in the doc's accessibility table. If any pair falls under 4.5:1 for body text or 3:1 for large text, propose a token adjustment (likely darkening `--ink-muted` to `#37433f` or similar) and revisit Unit 1.
- **Whether `.legend-swatch.point-two / .point-seven` rules and `WrappedNormalVisual`'s inline `#238457 / #2f66b1` migrate to `series[2]` / `series[0]` (bluish-green / blue) or stay on legacy hex.** Lean toward migrating in Unit 3 for consistency; verify the resulting hue shift is acceptable visually.
- **Whether to expose the chart neutrals (`axis`, `gridline`, `label`) also as CSS variables.** Probably yes for symmetry, but defer until Unit 3 sees how many CSS vs JS consumers each has.
- **Token names for the gold gradient (`#f4d481 → #e69d58`) on `.interval-segment`.** Decide during Unit 1: either a single `--accent-gold` token referenced inside the gradient declaration, or two tokens (`--accent-gold-light`, `--accent-gold-deep`).

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

**Token layering:**

```
:root  (global.css)                         tokens.ts
─────────────────────────────────           ─────────────────────────
 --surface-canvas: #f6f1e8;                 export const chartPalette = {
 --surface-card:   #fffaf1;                   series:   [...4 hex...],
 --ink-body:       #3f4d48;                   regionFill:    { cool, warm },
 --accent-warm:    #d24b2a;                   diverging:     { positive, negative },
 --chart-series-1: #0072B2;                   neutrals: { axis, gridline, label },
 ...                                        }
 --space-page-max: 1180px;
 --space-section:  28px;
 ...
        │                                          │
        ▼                                          ▼
  global.css rules                          Recharts <Line stroke={...} />,
  (.applet-card, .math-step, etc.           <Bar fill={...} />, etc.
   reference var(--...))
```

**Doc structure (docs/design-system.md):**

```
# StatQuest Design System
1. Principles                       ← editorial, calm, hairline, sharp
2. Tokens reference                  ← table: name → value → role
3. Type scale                        ← Georgia headlines, sans body, clamp() rules
4. Spacing & layout                  ← 1180px max, rhythm, breakpoint
5. Surfaces, borders, focus, motion
6. Chart palette                     ← Okabe-Ito + region fill + diverging
7. Accessibility floor               ← contrast audit table, focus, reduced-motion
8. Pattern catalog                   ← one entry per .class hook: purpose, when, do/don't
9. How to add an applet              ← agent-targeted checklist
10. Proposing new tokens             ← when literals slip in
```

## Implementation Units

- [ ] **Unit 1: Extract semantic tokens into `:root` and refactor `global.css` to reference them**

**Goal:** Replace every color, spacing, max-width, and type-scale literal in `src/styles/global.css` with `var(--token)` references defined in a new, well-organized `:root` block at the top of the file. Visual output is byte-identical.

**Requirements:** R2, R6.

**Dependencies:** None.

**Files:**
- Modify: `src/styles/global.css`
- Test: existing `src/**/*.test.tsx` suite (no new tests; visual identity is the contract)

**Approach:**
- Group `:root` tokens in this order: surfaces → ink → accents → borders → spacing → type-scale → gold-gradient stops. Each token has a one-line comment naming its role.
- Audit *every* hex/rgba literal in the file. Map to an existing token; if a literal has no natural semantic name, propose one before inlining.
- Preserve `clamp()` declarations as-is but extract the min/preferred/max anchors into tokens where they repeat (e.g. the `clamp(2.4rem, 6vw, 6rem)` shared by `.catalog-intro h2` and `.intro-band h2`).
- Leave `box-sizing`, `min-height`, `display`, and other layout primitives untouched — only literal *values* become tokens.

**Patterns to follow:** the existing `:root` block at lines 1–9; extend it rather than restructure the file.

**Test scenarios:**
- `npm test` passes unchanged.
- `npm run build` succeeds.
- Manual: open the dev server, walk all three tabs of the Benford applet, confirm no visible color/spacing change.

**Verification:**
- `rg "#[0-9a-fA-F]{3,8}" src/styles/global.css` returns matches only inside the `:root` token definitions.
- Every CSS rule that previously used a hex literal now uses `var(--…)`.

- [ ] **Unit 2: Add chart palette tokens to `:root` and create `src/styles/tokens.ts`**

**Goal:** Introduce the new chart-domain tokens (series 1–4, region fill cool/warm, diverging positive/negative, chart neutrals) as CSS custom properties *and* mirror the chart subset in a typed TypeScript module that Recharts consumers can import.

**Requirements:** R3, R6.

**Dependencies:** Unit 1.

**Files:**
- Modify: `src/styles/global.css` (additive — no existing rules change)
- Create: `src/styles/tokens.ts`
- Test: `src/styles/tokens.test.ts` (new)

**Approach:**
- In `global.css`, append a `Chart palette` section to `:root`: `--chart-series-1` through `--chart-series-4`, `--chart-region-cool`, `--chart-region-warm`, `--chart-diverging-positive`, `--chart-diverging-negative`, `--chart-axis`, `--chart-gridline`, `--chart-label`.
- In `tokens.ts`, export a single `chartPalette` object with the same role names. Values are string literals (hex/rgba) duplicated from the CSS source-of-truth. Comment the file with a one-liner: *"Mirrors the chart subset of `:root` in `src/styles/global.css`. Keep in sync."*
- Resolve the open question on `point-two / point-seven` legend swatches: in Unit 3 these get migrated; in this unit, leave them as legacy hex untouched.

**Patterns to follow:** named-export convention from `src/lib/*` (e.g. `presets.ts` exports a typed constant); `camelCase` keys per `AGENTS.md`/`CLAUDE.md` conventions.

**Test scenarios:**
- `chartPalette.series` has length 4 and every value matches `/^#[0-9A-F]{6}$/i`.
- Diverging pair values are equal to the corresponding series entries (positive === series[0], negative === series[1]) — pins the documented relationship so a future drift causes a test failure.
- Region-fill values parse as valid `rgba(...)` strings.

**Verification:**
- New test file passes.
- `npm run build` succeeds; no TypeScript errors.

- [ ] **Unit 3: Migrate chart components and the legend swatch CSS to consume the palette**

**Goal:** Replace every inline hex literal in `src/components/charts/*.tsx` and `src/components/WrappedNormalVisual.tsx` with references to `chartPalette` (or to `var(--…)` for CSS rules). Bring drifted colors (`#238457`, `#2f66b1`, `#e6b85a`, `#6b7f78`, `#8a938e`) onto canonical palette values.

**Requirements:** R3.

**Dependencies:** Unit 2.

**Files:**
- Modify:
  - `src/components/charts/BenfordPmfChart.tsx` (`#1f3832` → `var(--accent-deep)` if used in style, or `chartPalette.series[0]` if it's the data line — verify role at implementation time)
  - `src/components/charts/FirstDigitChart.tsx` (`#1f3832`, `#e6b85a`)
  - `src/components/charts/FractionalLogHistogram.tsx` (`#d24b2a`)
  - `src/components/charts/LogHistogram.tsx` (`#6b7f78` — likely an axis/gridline neutral; map to `chartPalette.neutrals.axis`)
  - `src/components/charts/OriginalValueHistogram.tsx` (`#8d3d25`)
  - `src/components/WrappedNormalVisual.tsx` (`#238457` → `chartPalette.series[2]`; `#2f66b1` → `chartPalette.series[0]`; `#1f3832`, `#8a938e`, `#8d3d25` → semantic ink/accent equivalents)
  - `src/styles/global.css` — `.legend-swatch.point-two` / `.point-seven` backgrounds reference `var(--chart-series-3)` / `var(--chart-series-1)` to stay in lockstep with `WrappedNormalVisual`.
- Test: existing `*.test.tsx` files for each touched component

**Approach:**
- For each component, classify each inline color: *series* (data-bearing), *neutral* (axis/gridline/label), or *accent* (an editorial highlight that belongs in `--accent-*`, not the chart palette).
- Decide series-index assignment per chart at implementation time based on what reads best; document the assignment as a one-line comment at the top of each chart file.
- Visual shift: the `WrappedNormalVisual` point colors will change slightly (`#238457` → `#009E73`, `#2f66b1` → `#0072B2`). Verify the resulting density curves still read clearly; if not, swap series indices or fall back to legacy values and capture the decision in `Deferred to Implementation`.

**Patterns to follow:** Recharts components in this repo pass colors as props (`stroke={...}`, `fill={...}`) — keep that style; do not move colors into `style={}` blocks.

**Test scenarios:**
- All existing chart tests pass with no assertion changes.
- Manual visual review of every chart on every tab; capture any unintended shifts.

**Verification:**
- `rg "#[0-9a-fA-F]{3,8}" src/components/` returns no matches outside test files (test fixtures may legitimately contain hex strings for mock data, e.g. swatch tests).
- All four ordered-series colors appear at least once across the codebase, confirming the palette is exercised.

- [ ] **Unit 4: Write `docs/design-system.md` (including contrast audit) and link from `README.md`, `AGENTS.md`, `CLAUDE.md`**

**Goal:** Produce the agent-readable design document, the single source of truth that future applets reference. Include a measured WCAG AA contrast audit of every documented surface/ink pair.

**Requirements:** R1, R4, R5.

**Dependencies:** Units 1–3 (so the doc reflects the final token names and palette values).

**Files:**
- Create: `docs/design-system.md`
- Modify: `README.md` (add a "Design system" pointer under or near the architecture section)
- Modify: `AGENTS.md` (one paragraph: "When adding or modifying applets, read `docs/design-system.md` first. Reuse documented patterns; propose new tokens rather than inlining literals.")
- Modify: `CLAUDE.md` (mirror the same paragraph, since the project still maintains CLAUDE.md as compatibility context)

**Approach:**
- Follow the 10-section doc structure shown in High-Level Technical Design above.
- For each pattern (Eyebrow, HeroBand/IntroBand, DefinitionPanel, ScenarioCard, MathStep, FormulaBlock, KeyRequirement, ChartFrame, PageTabs, SecondaryAction, ControlPanel, DiagnosticSummary): give purpose, the canonical CSS class hook, one example use from the current Benford applet, and a 2-line do/don't.
- Contrast audit table: every documented surface × ink combination, measured with a known tool (e.g. WebAIM contrast checker), with pass/fail against AA. If any pair fails, fix the token in Unit 1 and re-measure rather than documenting a known-failing pair.
- "How to add an applet" section is a numbered checklist a coding agent can follow: (1) add an entry to `src/app/applets.ts`; (2) create `src/applets/<name>/<Name>Applet.tsx`; (3) for the hero use `.hero-panel` or `.intro-band`; (4) for explainer steps use `.math-step` + `FormulaBlock`; (5) for the lab use `.control-panel` + `.chart-grid` + `.chart-frame`; (6) chart colors come from `chartPalette`, never inlined; (7) if a new pattern is needed, document it in this file before using it.
- "Proposing new tokens" section: short paragraph telling agents what to do when a literal feels necessary (open the design doc, add the token to `:root` and to `tokens.ts` if chart-domain, document the role, then use it).

**Patterns to follow:** existing brainstorm and plan markdown style; tables; relative links to source files.

**Test scenarios:** N/A (documentation).

**Verification:**
- Every token listed in the doc exists in `:root` (cross-check by name).
- Every pattern listed has a corresponding `.class` hook present in `global.css`.
- Contrast audit table contains no failing pairs.
- `README.md`, `AGENTS.md`, `CLAUDE.md` each link to `docs/design-system.md`.

## System-Wide Impact

- **Interaction graph:** Chart components are the only runtime consumers of color values. Migration is local to each component file.
- **Error propagation:** None — no behavioral code changes.
- **State lifecycle risks:** None.
- **API surface parity:** `chartPalette` becomes a new public-by-convention module under `src/styles/`. Future applets import from it; agents are told to use it via the design doc.
- **Integration coverage:** Visual identity of the Benford applet is the only integration contract; verified manually since the repo has no screenshot/visual-regression tooling.

## Risks & Dependencies

- **Visual drift from chart migration (Unit 3).** Mitigation: do Unit 3 last among code units so any token tweak from the contrast audit (Unit 4) has already settled; walk every chart visually before declaring done; commit Units 1–3 separately so a regression can be bisected.
- **Test brittleness on color migration.** Low risk — confirmed by inspection that tests assert on text/roles, not hex. If any test does grep hex (unlikely), update it as part of Unit 3.
- **Contrast audit fails for a documented pair.** Mitigation: Unit 4 explicitly cycles back to Unit 1 if any pair fails; do not ship the doc with known-failing pairs.
- **Token sprawl.** Mitigation: every proposed token must have a documented *role*, not just a value. The "Proposing new tokens" section in the doc is the gatekeeping mechanism.
- **`tokens.ts` and `:root` drifting out of sync.** Mitigation: comment at the top of `tokens.ts` flagging it as a mirror; the Unit 2 test pins the documented relationships (e.g. diverging === first two series).

## Documentation / Operational Notes

- `docs/design-system.md` is the durable artifact. Treat it as a living doc — update it in the same PR as any future token addition or pattern change.
- No deployment, monitoring, or feature-flag implications. This is a documentation + refactor change; the SPA is static.
- A short follow-up issue may be useful: *"Consider extracting React primitives (`<HeroBand>`, `<ChartFrame>`) once a second applet exists,"* deliberately out of scope here.

## Sources & References

- **Origin document:** [docs/brainstorms/2026-05-15-statquest-design-system-requirements.md](../brainstorms/2026-05-15-statquest-design-system-requirements.md)
- Related plans: `docs/plans/2026-05-09-001-feat-benford-emergence-applet-plan.md`, `docs/plans/2026-05-09-002-feat-three-tab-benford-applet-plan.md`, `docs/plans/2026-05-10-001-feat-wrapped-normal-density-visual-plan.md`
- Stylesheet: `src/styles/global.css`
- Chart consumers: `src/components/charts/*.tsx`, `src/components/WrappedNormalVisual.tsx`
- External: Okabe & Ito (2008), *Color Universal Design* — https://jfly.uni-koeln.de/color/
