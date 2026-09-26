import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite's current minifier distorts KaTeX commands in the production bundle.
    minify: false
  }
});
