# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm install          # install dependencies
npm run dev          # start Vite dev server
npm test             # run Vitest suite once
npm run test:watch   # run tests in watch mode
npm run build        # tsc --noEmit + Vite build
```

To run a single test file: `npx vitest run src/lib/benford.test.ts`

## Architecture

StatQuest is a static Vite + React + TypeScript SPA — no backend, no environment variables.

### Applet registry

`src/app/applets.ts` exports `availableApplets: AppletDefinition[]`. Adding a new applet means adding one entry here with `{ id, title, subtitle, conceptArea, component }`. `App.tsx` renders the catalog and mounts the selected applet component.

### Applet structure

Each applet lives under `src/applets/{name}/`. Currently only `benford/BenfordApplet.tsx`, which owns tab state (`what` | `why` | `simulations`) and renders one of three page components per tab.

### Domain lib (`src/lib/`)

Pure TypeScript — no React dependencies. All math and simulation logic belongs here.

- `benford.ts` — core math: `benfordProbability()`, `decomposePositive()`, `fractionalLog10()`, `firstDigitFromLog10()`
- `simulation.ts` — `simulateDirectLognormal()` and `simulateMultiplicativeGrowth()`, both returning `SimulatedSample` (values, logSamples, fractionalLogs, firstDigits, logWidth)
- `diagnostics.ts` — `evaluateSample()` computing RMSE vs Benford distribution and classifying log width as narrow / transitional / wide
- `presets.ts` — named `LabConfig` presets used by SimulationLab; `clonePreset()` returns a deep clone
- `random.ts` — seeded PRNG and `normalRandom()` (Box-Muller)
- `histograms.ts` — histogram binning utilities
- `wrappedNormal.ts` — wrapped normal density for the explainer visual

### Components (`src/components/`)

React components that render and wire up the domain lib. Chart components live in `src/components/charts/` and wrap Recharts. Keep domain calculations out of components — components handle rendering and interaction state only.

### Styling

Single file: `src/styles/global.css`. No CSS modules or utility framework. Every color, surface, border, spacing, and shared type value is a semantic CSS custom property on `:root` (`--surface-*`, `--ink-*`, `--accent-*`, `--border-*`, `--space-*`, `--type-*`, `--chart-*`). Chart components read colors from `src/styles/tokens.ts` (`chartPalette`, `editorialColors`) — never inline hex literals.

### Design system

**Read [`docs/design-system.md`](docs/design-system.md) before adding or modifying any applet.** It documents principles, the token reference, the pattern catalog (HeroBand, DefinitionPanel, MathStep, FormulaBlock, ChartFrame, ControlPanel, etc.), the chart palette (Okabe-Ito ordered series + region fills + diverging pair), the WCAG AA contrast audit, and a "How to add an applet" checklist. Propose new tokens there before inlining any literal.

## Testing

Vitest + jsdom + Testing Library. Tests are colocated (`*.test.ts` / `*.test.tsx`). Follow red-green TDD for domain logic and component behavior; visual-only styling changes do not require it. Run `npm test` before submitting; also run `npm run build` for UI or build-related changes.

## Conventions

- Two-space indentation, double quotes, semicolons
- Named exports for all reusable helpers
- `PascalCase` components, `camelCase` functions/variables
- Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`
- Planning docs and notes go under `docs/plans/`
