---
date: 2026-05-15
topic: statquest-design-system
---

# StatQuest Design System

## Problem Frame

StatQuest is a Vite + React + TypeScript SPA that will host a growing catalog of probability and statistics applets. Today there is one applet (Benford) and a single `src/styles/global.css` file. The visual language inside that file is already coherent — warm editorial palette, Georgia serif headlines, terracotta and forest-green accents, hairline borders, no shadows or rounded corners, repeated structural patterns (hero band, definition panel, math step, chart frame, scenario card, page tabs).

The problem is that this language is **implicit**. Coding agents (and humans) adding the next applets — distributions, CLT / hypothesis tests / CI, Bayesian and regression — will either re-derive ad-hoc colors and spacing from existing CSS or invent their own, causing visual drift. We also lack a documented ordered-series palette, region-fill color, and diverging color, all of which the upcoming applets will need.

The goal is to **codify the existing direction, expand it just enough for the planned applet roadmap, and make the result agent-readable** so future applets adhere to it by default.

## Requirements

- **R1.** A `docs/design-system.md` exists that documents principles, tokens, type scale, spacing scale, surfaces/borders, motion (or lack thereof), focus styling, and the canonical component patterns currently in use (Eyebrow, HeroBand / IntroBand, DefinitionPanel, ScenarioCard, MathStep, FormulaBlock, KeyRequirement, ChartFrame, PageTabs, SecondaryAction, ControlPanel, DiagnosticSummary). For each pattern: purpose, when to use it, the CSS class hook(s), and a short do/don't.
- **R2.** All color, type, spacing, and border values used by `global.css` are extracted into CSS custom properties on `:root` with semantic names (e.g. `--surface-canvas`, `--surface-card`, `--ink-body`, `--ink-muted`, `--accent-warm`, `--accent-deep`, `--border-hairline`). Existing class rules reference these tokens rather than hex literals.
- **R3.** A documented **chart palette** that supports the planned applets:
  - An **ordered series palette** of at least 4 colors usable as prior / likelihood / posterior / observed, or sample / population / CI / reference — distinguishable in normal vision and color-blind-safe.
  - A **region-fill** token (translucent) for p-value / CI / rejection-region shading.
  - A **diverging pair** (positive / negative) for residuals or signed effects.
  - Each color has a documented role; charts should pick by role, not by hex.
- **R4.** A short **"How to add an applet"** section in the design doc that tells a coding agent: which existing pattern to reuse for the hero, the explainer math steps, the interactive lab, and the diagnostic readouts; when to add a new pattern vs. extend an existing one; and what to do when a new color or spacing value seems necessary (answer: propose it as a token, don't inline it).
- **R5.** Accessibility floor is documented and met: WCAG AA contrast for body text and interactive labels against their backgrounds; focus styling preserved (current `outline: 3px solid var(--accent-warm)` is fine); reduced-motion respected (the system is mostly static, but state this explicitly).
- **R6.** The system is **light-only**. Tokens are named semantically (surface / ink / accent) so a future dark theme is not blocked, but no dark theme is authored now.

## Success Criteria

- A coding agent given the prompt "add a new applet that visualizes the Central Limit Theorem" can read `docs/design-system.md` and produce a layout that visually matches Benford without inventing new colors, fonts, or structural patterns.
- The Benford applet renders identically after the token refactor (visual diff is empty); no class names or component APIs change.
- The chart palette is sufficient to render a Bayesian prior/likelihood/posterior overlay and a CLT sample-vs-population chart without needing new colors.
- `global.css` contains no hex color literals outside the `:root` token block.

## Scope Boundaries

- **Not** redesigning the current look — direction is held; only consistency and palette breadth are expanded.
- **Not** introducing a CSS framework, utility classes, CSS modules, or styled-components — `global.css` stays the single stylesheet.
- **Not** extracting React component primitives (`<HeroBand>`, `<ChartFrame>`, etc.) in this round — patterns are documented by their CSS class hooks; component extraction is a separate future decision.
- **Not** shipping a dark theme.
- **Not** building applet-specific styling guidance beyond the categories named in the roadmap.
- **Not** adding graph/network primitives (no Markov-chain applets planned in the near roadmap).

## Key Decisions

- **Light-only, semantic tokens**: surface/ink/accent naming chosen over literal naming (`--cream`, `--terracotta`) so a future theme swap is mechanical, but no second theme ships now.
- **Doc + tokens, not component extraction**: lowest carrying cost that still gives agents a referenceable source of truth. Component primitives can come later once a second applet validates the patterns.
- **Chart palette sized for ordered series of 4**: covers the three planned applet families (distributions, inference, Bayesian/regression) without speculative breadth.
- **Direction held, palette expanded**: current editorial look is the canonical direction; expansion is additive (chart series, region fill, diverging), not substitutive.

## Dependencies / Assumptions

- The current Benford applet is the visual reference; whatever it ships with today is the canonical look unless explicitly listed as drift to fix.
- Recharts remains the charting library; chart palette tokens are exposed as plain CSS variables / TS constants that Recharts components can consume.
- Tests in `*.test.tsx` rely on text content and roles, not on hex values, so a pure token refactor will not require test updates. (To be verified during planning.)

## Outstanding Questions

### Resolve Before Planning
- _(none)_

### Deferred to Planning
- [Affects R2][Technical] Should chart palette tokens also be exposed as a typed TypeScript constant (e.g. `src/styles/tokens.ts`) for Recharts `<Line stroke={...} />` props, or read via `getComputedStyle` from CSS variables? Pick the lower-friction option after a quick prototype.
- [Affects R3][Needs research] Verify the proposed ordered-series palette against a common color-blind simulation (deuteranopia/protanopia) before locking it in.
- [Affects R1] Decide whether the design doc lives at `docs/design-system.md` or `docs/design/README.md` — preference for the former unless planning surfaces a reason to nest.
- [Affects R5][Technical] Audit existing card-on-cream contrast pairs (e.g. `#fffaf1` card on `#f6f1e8` page, `#3f4d48` body text) and document any that fall under WCAG AA, plus the fix.

## Next Steps

→ `/ce:plan` for structured implementation planning
