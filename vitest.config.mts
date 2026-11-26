import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      // Unit tests cover the pure core (match simulation, battle scoring,
      // league standings, string helpers). UI components are exercised by
      // the Playwright smoke suite instead, so they stay out of the
      // unit-test coverage gate.
      include: ["src/lib/**", "src/data/**"],
      thresholds: {
        "src/lib/**": { statements: 90, branches: 80, functions: 90, lines: 90 },
        // The datasets are asserted for full integrity (uniqueness, references,
        // on-disk files), and every lookup helper is exercised. Branches stay
        // below 100 only because of defensive fallbacks (e.g. the "Europe"
        // region default) that a valid dataset can never reach.
        "src/data/**": { statements: 100, branches: 85, functions: 100, lines: 100 },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
