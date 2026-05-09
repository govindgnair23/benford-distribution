# Benford Emergence Lab

Interactive browser applet for understanding when Benford's Law appears and when it does not.

The app focuses on the causal chain:

1. Multiplicative processes turn into sums in log space.
2. `log10(X)` can become approximately Normal.
3. Benford-like first digits appear when `{log10(X)}` becomes nearly uniform.
4. Wide log distributions help, but the fractional-log histogram is the direct diagnostic.

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
