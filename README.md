# StatQuest

Interactive browser applet library for exploring statistics, probability, and data intuition.

The first available applet is Benford Emergence Lab, an interactive browser applet for understanding what Benford's Law says, why it can appear, and when it does not.

The Benford applet has three tabs:

1. What is Benford's Law? Define the first-digit PMF, show the decreasing histogram, and calculate why `P(D = 1)` is about 30.1%.
2. Why it Happens. Walk through the log-scale argument with LaTeX-rendered formulas: decomposition, fractional logs, products-to-sums, and wide Normal wrapping.
3. Simulations. Adjust direct lognormal and multiplicative-growth models to see when fractional logs flatten and first digits become Benford-like.

The core idea is that Benford-like first digits appear when `{log10(X)}` becomes nearly uniform. Wide log distributions help, but the fractional-log histogram is the direct diagnostic.

## Local Development

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

Run tests:

```sh
npm test
```

Build static output:

```sh
npm run build
```

## Deployment

This is a static Vite app. Vercel can deploy it directly from the repository using the default Vite build output. The app has no backend, no serverless functions, and no required environment variables.

`vercel.json` includes a single SPA fallback rewrite to `index.html`.
