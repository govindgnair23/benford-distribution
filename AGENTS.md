# Repository Guidelines

## Project Structure & Module Organization

This repository is a static Vite React app for exploring Benford's Law. Application entry points live in `src/main.tsx` and `src/app/App.tsx`. Reusable math, simulation, randomization, histogram, and diagnostic logic belongs in `src/lib/`. React UI components live in `src/components/`, with chart-specific components in `src/components/charts/`. Shared styles are in `src/styles/global.css`, and Vitest setup is in `src/test/setup.ts`.

Tests are colocated with the code they cover using `*.test.ts` or `*.test.tsx`. Project notes, plans, and explanatory material live under `docs/`. Build output is generated in `dist/` and should not be edited directly.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server.
- `npm test`: run the full Vitest suite once with `vitest.config.ts`.
- `npm run test:watch`: run tests in watch mode while developing.
- `npm run build`: type-check with `tsc --noEmit` and build the static Vite output.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing style: two-space indentation, double quotes, semicolons, and named exports for reusable helpers. Use `PascalCase` for components, `camelCase` for functions and variables, and descriptive filenames such as `SimulationControls.tsx` or `benford.test.ts`.

Keep domain calculations in `src/lib/` rather than embedding them in components. Components should focus on rendering, interaction state, and wiring.

## Testing Guidelines

Use Vitest with the jsdom environment and Testing Library for React behavior. Follow red-green TDD when implementing behavior or domain logic: write a failing test first, make the smallest change that passes, then refactor. UI edits, especially visual-only styling and layout changes, do not need red-green TDD. Name tests after the unit or component being exercised, for example `src/lib/simulation.test.ts` or `src/components/SimulationLab.test.tsx`.

Run `npm test` before submitting changes. For UI or build-related changes, also run `npm run build`.

## Commit & Pull Request Guidelines

The current history uses concise Conventional Commit-style messages, such as `feat: clarify Benford teaching flow`. Prefer `feat:`, `fix:`, `test:`, `docs:`, or `refactor:` followed by a short imperative summary.

Pull requests should include a brief description of the user-visible change, tests run, and any relevant screenshots for visual UI changes. Link related issues or planning docs when applicable, especially items under `docs/plans/`.

## Security & Configuration Tips

The app has no backend and no required environment variables. Keep it that way unless a feature clearly requires otherwise. Do not commit generated build artifacts, secrets, local editor files, or dependency cache directories.
