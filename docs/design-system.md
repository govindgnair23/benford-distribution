# StatQuest Design System

This is the source of truth for the visual language of StatQuest applets. **Read this before adding or modifying any applet.** When a literal value (color, spacing, font size) feels necessary, propose a token here first — do not inline it.

The system is **light-only**, editorial in tone, and intentionally calm: warm cream surfaces, Georgia serif headlines, terracotta and forest-green accents, hairline borders, no shadows, no rounded corners. The goal is teaching clarity, not visual novelty.

- **CSS source of truth:** [`src/styles/global.css`](../src/styles/global.css) — `:root` block at the top.
- **TypeScript mirror (charts only):** [`src/styles/tokens.ts`](../src/styles/tokens.ts) — `chartPalette` and `editorialColors`. Keep in sync with `:root`.

---

## 1. Principles

- **Editorial, not dashboard.** Treat applets like magazine spreads: a clear headline, a single column of reasoning, math that breathes. Avoid card-stuffing and visual density.
- **Restrained type scale.** Display headlines top out around 3rem (~48px), section titles around 2.5rem (~40px), the topbar around 2rem (~32px). The editorial weight comes from Georgia serif + air + hairline rules, not from oversized type. Don't introduce headings larger than `--type-display`.
- **Hairlines over shadows.** Separation comes from 1px borders and surface contrast, never from drop shadows or elevation.
- **Sharp corners.** `border-radius: 0` everywhere. The exception is bar charts, which use a small top-corner radius (`[3, 3, 0, 0]`) for legibility.
- **Calm motion.** No animation on load, no parallax. Recharts components disable `isAnimationActive`. Respect `prefers-reduced-motion`.
- **One stylesheet.** Everything lives in `global.css`. No CSS modules, no utility framework, no styled-components.
- **Tokens, not literals.** Every color, page-max-width, repeated spacing, and shared font stack is a `:root` custom property. Components reference `var(--token)`; TSX components import from `tokens.ts`.

## 2. Tokens

All values defined on `:root` in `src/styles/global.css`. Use these names in CSS rules and in new tokens you propose.

### Surfaces

| Token              | Value     | Role                                      |
| ------------------ | --------- | ----------------------------------------- |
| `--surface-canvas` | `#f6f1e8` | Page background                           |
| `--surface-card`   | `#fffaf1` | Card / panel surface; also ink-on-accent  |
| `--surface-sunken` | `#f8efe0` | Sub-card, scenario tile, density block    |
| `--surface-input`  | `#fffdf8` | Form input background                     |

### Ink

| Token              | Value     | Role                                |
| ------------------ | --------- | ----------------------------------- |
| `--ink-strong`     | `#18211f` | Primary body & display text         |
| `--ink-body`       | `#3f4d48` | Prose, paragraph copy               |
| `--ink-label`      | `#31423d` | Form labels                         |
| `--ink-muted`      | `#65716c` | Chart captions, diagnostic labels   |
| `--ink-on-accent`  | `#fffaf1` | Text on dark/warm accent surfaces   |

### Accents

| Token                  | Value                       | Role                                       |
| ---------------------- | --------------------------- | ------------------------------------------ |
| `--accent-warm`        | `#d24b2a`                   | Focus outline, primary action bg, formula border |
| `--accent-warm-deep`   | `#8d3d25`                   | Eyebrow text, applet-area label            |
| `--accent-warm-text`   | `#7b402b`                   | Warm caption text on light surfaces        |
| `--accent-deep`        | `#1f3832`                   | Deep editorial accent, active tab bg       |
| `--accent-deep-soft`   | `rgba(31, 56, 50, 0.24)`    | 24%-alpha deep, for inner dividers         |
| `--accent-gold-light`  | `#f4d481`                   | Gold-gradient start (interval segments)    |
| `--accent-gold-deep`   | `#e69d58`                   | Gold-gradient end                          |

### Borders

| Token               | Value     | Role                |
| ------------------- | --------- | ------------------- |
| `--border-hairline` | `#cdbfa8` | Section dividers    |
| `--border-card`     | `#d9cdb8` | Card borders        |
| `--border-input`    | `#b9aa93` | Form input borders  |

### Chart palette (Okabe-Ito, color-blind-safe)

Use these for *data series* — anything that varies across applets, parameters, or distributions. For editorial accents inside a chart (a canonical reference line, a "this is the Benford curve" bar), use `editorialColors` from `tokens.ts` instead.

| Token                         | Value                          | Role                                                  |
| ----------------------------- | ------------------------------ | ----------------------------------------------------- |
| `--chart-series-1`            | `#0072b2`                      | Primary / posterior / observed sample                 |
| `--chart-series-2`            | `#d55e00`                      | Secondary / likelihood / population                   |
| `--chart-series-3`            | `#009e73`                      | Tertiary / prior / reference                          |
| `--chart-series-4`            | `#cc79a7`                      | Quaternary / additional overlay                       |
| `--chart-region-cool`         | `rgba(31, 56, 50, 0.14)`       | CI bands, selected regions                            |
| `--chart-region-warm`         | `rgba(210, 75, 42, 0.14)`      | Rejection regions, highlights                         |
| `--chart-diverging-positive`  | `#0072b2`                      | Positive residual (mirrors `--chart-series-1`)        |
| `--chart-diverging-negative`  | `#d55e00`                      | Negative residual (mirrors `--chart-series-2`)        |
| `--chart-axis`                | `#65716c`                      | Axis lines and tick labels                            |
| `--chart-gridline`            | `#d9cdb8`                      | Gridlines                                             |
| `--chart-label`               | `#65716c`                      | In-chart text                                         |

**Color-blind safety:** the series palette is the canonical Okabe-Ito ordered set, validated by its authors against deuteranopia, protanopia, and tritanopia. See https://jfly.uni-koeln.de/color/. Do not substitute alternatives without re-verifying.

### Layout

| Token             | Value    | Role                                  |
| ----------------- | -------- | ------------------------------------- |
| `--page-max`      | `1180px` | Max content width for every page band |
| `--space-section` | `28px`   | Page-band padding                     |
| `--space-card`    | `22px`   | Card/panel padding                    |
| `--space-panel`   | `18px`   | Smaller panel padding                 |
| `--space-control` | `14px`   | Control-row gap, formula-block pad-y  |

### Type

| Token            | Value                                           | Role                                          |
| ---------------- | ----------------------------------------------- | --------------------------------------------- |
| `--font-serif`   | `Georgia, "Times New Roman", serif`             | All headlines and editorial display           |
| `--font-mono`    | `"SFMono-Regular", Consolas, ..., monospace`    | Inline formulas, code                         |
| `--type-display` | `clamp(1.85rem, 3.4vw, 3rem)`                   | Catalog/applet/intro big headlines (top ~48px) |
| `--type-section-title` | `clamp(1.65rem, 2.8vw, 2.5rem)`           | Tab/page section headlines (top ~40px)        |
| `--type-topbar`  | `clamp(1.4rem, 2.2vw, 2rem)`                    | Topbar h1 (top ~32px)                         |

Body text is sans-serif (Avenir Next + system fallbacks, set on `:root`). Use `--type-display` only for top-level applet/catalog identity headlines, and use `--type-section-title` for tab/page titles such as lab headers.

## 3. Accessibility

**Floor:** WCAG AA contrast for all body text and interactive labels. Focus styling is preserved on every interactive element (`button:focus-visible`, `a:focus-visible`, `input:focus-visible`, `select:focus-visible`) via `3px solid var(--accent-warm)`.

### Contrast audit

Measured against WCAG 2.1 AA: 4.5:1 for normal text, 3:1 for large text (≥18pt regular or ≥14pt bold).

| Pair                                              | Ratio     | AA Normal | AA Large |
| ------------------------------------------------- | --------- | --------- | -------- |
| `--ink-strong` on `--surface-canvas`              | **14.63** | ✅        | ✅       |
| `--ink-strong` on `--surface-card`                | **15.83** | ✅        | ✅       |
| `--ink-strong` on `--surface-sunken`              | **14.43** | ✅        | ✅       |
| `--ink-body` on `--surface-canvas`                | **7.89**  | ✅        | ✅       |
| `--ink-body` on `--surface-card`                  | **8.53**  | ✅        | ✅       |
| `--ink-body` on `--surface-sunken`                | **7.78**  | ✅        | ✅       |
| `--ink-label` on `--surface-card`                 | **10.21** | ✅        | ✅       |
| `--ink-muted` on `--surface-card`                 | **4.89**  | ✅        | ✅       |
| `--ink-muted` on `--surface-canvas`               | **4.52**  | ✅        | ✅       |
| `--accent-warm-deep` on `--surface-canvas` (eyebrow) | **6.60**  | ✅        | ✅       |
| `--accent-warm-deep` on `--surface-card`          | **7.14**  | ✅        | ✅       |
| `--accent-warm-text` on `--surface-card`          | **7.74**  | ✅        | ✅       |
| `--ink-on-accent` on `--accent-deep` (active tab) | **12.09** | ✅        | ✅       |
| `--ink-on-accent` on `--accent-warm` (action btn) | **4.23**  | ❌¹       | ✅¹      |
| `--ink-strong` on `--accent-gold-light`           | **11.43** | ✅        | ✅       |
| `--ink-strong` on `--accent-gold-deep`            | **7.31**  | ✅        | ✅       |

¹ `--ink-on-accent` on `--accent-warm` is used **only** on `.secondary-action`, which is `font-weight: 800` with `min-height: 42px` — qualifies as Large Text. Do not use this color pair for body-weight text.

### Motion

The system is mostly static. Recharts animations are disabled via `isAnimationActive={false}`. New applets that introduce motion (e.g. a slider-driven density update) MUST respect `@media (prefers-reduced-motion: reduce)` and provide a non-animated path.

## 4. Pattern catalog

Each pattern is described by the CSS class hook it ships with. Use the existing classes; if a new pattern is genuinely needed, document it here first.

### Eyebrow

`.eyebrow` — small caps label used above editorial headings ("DEEPER LOOK", section labels).
- **Do:** keep under five words. Use sparingly — one per panel, max.
- **Don't:** stack two eyebrows; don't use lowercase.

### HeroBand / IntroBand

`.hero-panel` (applet hero), `.intro-band` (page hero on tabs), `.catalog-intro` (catalog landing).
- Full-width hairline-bordered band with vertical centering. Applet/catalog identity headlines use `--type-display`; tab/page section headlines use `--type-section-title`.
- **Do:** one big headline + one summary paragraph. That is the entire pattern.
- **Don't:** add CTAs, badges, or imagery.

### DefinitionPanel / ScenarioSection / ComparisonBand

`.definition-panel`, `.scenario-section`, `.comparison-band` — cream `--surface-card` panels with hairline `--border-card`, `--space-card` padding, serif h3.
- Use for the explainer prose blocks on the "What" page.
- **Do:** put one self-contained idea per panel.
- **Don't:** nest panels inside panels.

### ScenarioCard

`.scenario-card` — `--surface-sunken` tile with a `--accent-deep` top border. Used inside `.scenario-grid`.
- **Do:** keep title ≤ 4 words and body ≤ 2 sentences.

### MathStep

`.math-step` — two-column grid (`minmax(220px, 0.75fr) minmax(0, 1.25fr)`) with a bottom hairline divider. The left column carries the step heading; the right carries prose and formulas.
- Use to walk through a derivation, one step per `.math-step` row.

### FormulaBlock

`.formula-block` — cream-tinted `<figure>` with a 4px `--accent-warm` left border and a 0.78rem uppercase warm caption.
- Use for any LaTeX/KaTeX expression that belongs in prose. Wrap the math in `.formula-math` for KaTeX rendering.
- **Do:** include a `<figcaption>` naming the expression.

### KeyRequirement

`.key-requirement` — cream-tinted block with a 4px `--accent-deep` left border, bold display text.
- Use for a one-line takeaway at the end of a math step ("For Benford behavior, log10(X) must be wide enough that the fractional logs flatten").
- **Don't:** stack multiple key-requirements per step.

### ChartFrame

`.chart-frame` (component in `src/components/charts/ChartFrame.tsx`) — cream `--surface-card` panel with hairline border, a serif h3 title, an `--ink-muted` summary line, and a `.chart-canvas` slot.
- **Always wrap charts in `<ChartFrame>`** — never put a raw `<ResponsiveContainer>` on the page.
- Chart colors come from `chartPalette` / `editorialColors` in `src/styles/tokens.ts`. Never inline hex.

### PageTabs

`.page-tabs` — flex-row of tab buttons, right-aligned on desktop, full-width on mobile. Active state: `--accent-deep` background with `--ink-on-accent` text.
- Use for top-of-applet tab switching (the Benford applet has `what | why | simulations`).

### SecondaryAction

`.secondary-action` — solid `--accent-warm` button with `--ink-on-accent` bold text, no border, no radius.
- The only button style in the system.
- **Do:** use sentence-case label, ≤ 3 words.

### ControlPanel

`.control-panel` — cream card containing `.control-row` grids of labeled inputs/selects, plus optional `.model-guidance`.
- Inputs use `--surface-input` background, `--border-input` border, `--ink-strong` text. Labels are 0.88rem bold `--ink-label`.

### DiagnosticSummary

`.diagnostic-summary` — 4-column grid of small caps `<span>` + bold value `<strong>` pairs, with an optional descriptive paragraph spanning all columns.
- Use for the "RMSE / log-width / classification" readout at the top of a lab.
- Technical metrics (SD, RMSE) carry a visible `<small class="metric-note">` caption explaining the number. **Don't** hide these behind `title=` hover tooltips — keyboard and touch users never see them.

### StatCallout

`.stat-callout` — a short cream line that pulls one number out of surrounding prose (e.g. "About **30.1%** of Benford values begin with 1").
- **Do:** wrap the figure in `<strong>`; keep to one sentence.
- **Don't:** stack several callouts; use a chart or list instead.

### CaveatNote

`.caveat-note` — a muted paragraph that concentrates all the "this may not hold" qualifications for a section in one place, so the surrounding copy can state the positive case plainly.
- **Do:** keep every hedge here rather than sprinkling "may / often / can" through each card.

### FormulaStack

`.formula-stack` — a `min-width: 0` column that stacks two or more `<FormulaBlock>` figures (general form + worked example) with no gap collapse.
- **Do:** pair a "general form" block with an "example" block.

### FormulaExplanationPairs

`.formula-explanation-pairs` — a two-column grid (matching `.math-step`) that alternates a `<FormulaBlock>` with the prose paragraph that reads it. Use when a derivation step needs formula-and-gloss pairs side by side.

### GuidanceColumns / guidance-threshold

`.guidance-columns` — a 4-up grid of short `<p>` definitions inside a `.model-guidance` panel (e.g. narrow / transitional / wide preset meanings).
`.guidance-threshold` — a muted single line beneath the columns that surfaces the numeric cutoffs behind a classification, so users can predict it.
- **Do:** source thresholds from the domain constant (`LOG_WIDTH_THRESHOLDS`) rather than hardcoding.

### IntervalStrip

`.interval-module` (wrapper), `.interval-strip` (`role="img"`), `.interval-segment` (gold-gradient cell sized by `flex-grow`), `.interval-legend` (overflow row).
- Segments narrower than ~6% of the strip drop their inline `<small>` percentage; those values move to the `.interval-legend` row beneath so they stay legible.
- **Do:** keep the strip's `aria-label` accurate, naming the largest and smallest intervals.

### WrapVisual family

`.wrap-visual`, `.wrap-visual-header`, `.wrap-density-grid`, `.wrap-density-panel`, `.wrap-density-legend`, `.wrap-density-values`, `.wrapped-profile-block`, `.wrap-conclusion` — the explainer's narrow-vs-wide Normal comparison. A header + a two-up grid of density panels, each with a `<ChartFrame>`, a summed-value `<dl>`, and a wrapped-density sub-chart.
- **Don't** reuse for generic charts; this is a bespoke pedagogical layout.

### SrSummary

`.sr-summary` — a list (or line) that restates a chart's data as text for screen readers and as a sighted fallback. Charts also ship a `.visually-hidden` per-bin/per-digit list for the full breakdown.
- **Do:** give every chart one plain-language summary; keep numbers in sync with the chart.
- **Don't** duplicate the same summary in two visible nodes.

### RangeInput

`.range-field` (wrapper), `.range-slider` (the `<input type="range">`) — a slider paired with a number input, kept in sync so either can drive a value (see `SimulationControls`).
- The number input carries the visible `<label>`; the slider carries a distinct `aria-label` ("<field> slider") so it is announced separately and doesn't collide in `getByLabelText`.
- Track is a 2px `--border-input` hairline; the thumb is a sharp-cornered 16px `--accent-warm` square (border-radius 0, on system). Focus shows the standard `--accent-warm` outline.
- **Do:** clamp both inputs to the same `[min, max]` and ignore empty/NaN edits before committing config.
- **Don't** give the range input a border/background box — it is excluded from the base `.control-panel input` rule via `:not([type="range"])`.

### ChartTooltip

`chartTooltipStyle` (exported from `src/styles/tokens.ts`) — the shared Recharts `<Tooltip>` styling: cream `--surface-card` background, 1px `--border-card` hairline, no radius, no shadow, `--ink-strong` text. Spread it: `<Tooltip {...chartTooltipStyle} />`.
- **Do:** use it on every chart tooltip so hover chrome matches the editorial surface. **Don't** leave a bare `<Tooltip />` (defaults to a white rounded shadowed box that breaks the system).

## 5. How to add an applet

You are a coding agent (human or AI) adding a new applet. Follow this in order.

1. **Register the applet.** Add an entry to `availableApplets` in `src/app/applets.ts`: `{ id, title, subtitle, conceptArea, component }`. Match the existing entry shape.
2. **Scaffold the component.** Create `src/applets/<name>/<Name>Applet.tsx`. If multi-tab, own tab state inside that component and render one page component per tab — mirror `src/applets/benford/BenfordApplet.tsx`.
3. **Hero / intro.** Wrap the first content band in `.hero-panel` (applet-level) or `.intro-band` (per-tab). One headline + one summary paragraph.
4. **Explainer / math.** Use `.what-page` or `.explainer-page` as the page container. Compose `.definition-panel`, `.math-step`, `<FormulaBlock>`, `.key-requirement`, `.scenario-card` to walk through the reasoning. Body copy is `--ink-body`; display headings are `var(--font-serif)`.
5. **Interactive lab.** Use `.lab-page` + `.lab-header` + `.control-panel` + `.diagnostic-summary` + `.chart-grid` containing `<ChartFrame>` wrappers. The Benford `SimulationLab` is the reference.
6. **Charts.** Wrap every Recharts component in `<ChartFrame>`. Read colors from `src/styles/tokens.ts`:
   - **Data series** → `chartPalette.series[0..3]` (in order: primary, secondary, tertiary, quaternary).
   - **CI / selected region fill** → `chartPalette.regionFill.cool`.
   - **Rejection region / Benford-flavored highlight** → `chartPalette.regionFill.warm`.
   - **Residuals / signed effects** → `chartPalette.diverging.positive` / `.negative`.
   - **Axis, gridline, in-chart text** → `chartPalette.neutrals.{axis,gridline,label}`.
   - **Canonical editorial accent inside a chart** (Benford reference bar, "the curve we're explaining") → `editorialColors.accentDeep` or `editorialColors.accentWarm`. Use sparingly — these are *not* generic series colors.
7. **Domain math.** Goes in `src/lib/`, never in components. Follow `AGENTS.md` rules: TDD for new domain helpers, named exports, `camelCase`.
8. **Tests.** Colocated `*.test.tsx` / `*.test.ts`. Run `npm test` and `npm run build` before committing.

## 6. Proposing new tokens

If you find yourself wanting to inline a literal — a new color, a one-off spacing, a font size — stop. Either:

- **Reuse** an existing token (most of the time, one already fits).
- **Add** the token to `:root` in `global.css`, name it semantically (`--accent-cool`, not `--blue`), document its role in section 2 of this file, and (if it will be consumed from TSX for a chart) mirror it in `src/styles/tokens.ts`. Update the contrast audit if it introduces a new ink/surface pair.

Drift happens when literals slip into chart components or one-off CSS rules. The `:root` block, this doc, and `tokens.ts` are the gatekeepers. Keep them in sync.
