import { chromium } from "@playwright/test";
import { existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Renders scripts/og-image.html to public/og.png — the site's social
 * preview (1200×630, wired into the Open Graph / Twitter metadata in
 * src/app/layout.tsx). Rerun after touching the layout:
 *   node scripts/render-og.mjs
 */
const here = dirname(fileURLToPath(import.meta.url));
const html = join(here, "og-image.html");
const out = join(here, "..", "public", "og.png");

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
await page.goto(`file://${html}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);
await page.screenshot({ path: out });
await browser.close();

if (!existsSync(out) || statSync(out).size < 10_000) {
  console.error("og.png is missing or suspiciously small");
  process.exit(1);
}
console.log(`og.png rendered (${statSync(out).size} bytes)`);
