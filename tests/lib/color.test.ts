import { describe, expect, it } from "vitest";
import { buildAccentVars, contrastColor } from "@/lib/color";

/** Same weighted-luminance formula the module uses internally. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

const white = { primary: "#FFFFFF", secondary: "#1E3A8A" };
const blackOnBlack = { primary: "#0A0A0A", secondary: "#101010" };

describe("contrastColor", () => {
  it("puts dark text on light fills and white text on dark fills", () => {
    expect(contrastColor("#FFFFFF")).toBe("#04070f");
    expect(contrastColor("#F5F5F5")).toBe("#04070f");
    expect(contrastColor("#000000")).toBe("#ffffff");
    expect(contrastColor("#1E3A8A")).toBe("#ffffff");
  });
});

describe("buildAccentVars", () => {
  it("exposes exactly the five custom properties the design system expects", () => {
    expect(Object.keys(buildAccentVars(white)).sort()).toEqual([
      "--accent",
      "--accent-contrast",
      "--accent-readable",
      "--accent-soft",
      "--accent-strong",
    ]);
  });

  it("keeps a usable primary verbatim and pairs it with dark contrast text", () => {
    const vars = buildAccentVars(white);
    expect(vars["--accent"]).toBe("#FFFFFF");
    expect(vars["--accent-contrast"]).toBe("#04070f");
  });

  it("falls back to the secondary when the primary is too dark for the page", () => {
    const vars = buildAccentVars({ primary: "#0A0A0A", secondary: "#FFFFFF" });
    expect(vars["--accent"]).toBe("#FFFFFF");
    expect(vars["--accent-contrast"]).toBe("#04070f");
  });

  it("lifts a fully dark palette until it clears the visibility threshold", () => {
    const vars = buildAccentVars(blackOnBlack);
    expect(vars["--accent"]).not.toBe("#0A0A0A");
    expect(luminance(vars["--accent"])).toBeGreaterThanOrEqual(0.12);
    expect(vars["--accent-contrast"]).toBe("#ffffff");
  });

  it("always returns a readable variant that clears the text-legibility bar", () => {
    for (const colors of [white, blackOnBlack, { primary: "#1E3A8A", secondary: "#D4AF37" }]) {
      const vars = buildAccentVars(colors);
      expect(luminance(vars["--accent-readable"])).toBeGreaterThanOrEqual(0.42);
    }
  });

  it("darkens a light accent for --accent-strong and lightens a dark one", () => {
    const light = buildAccentVars(white);
    expect(light["--accent-strong"]).not.toBe("#FFFFFF");

    const dark = buildAccentVars(blackOnBlack);
    expect(luminance(dark["--accent-strong"])).toBeGreaterThan(luminance(dark["--accent"]));
  });

  it("encodes --accent-soft as an rgba() tint of the accent", () => {
    const vars = buildAccentVars(white);
    expect(vars["--accent-soft"]).toMatch(/^rgba\(\d+, \d+, \d+, 0\.14\)$/);
    expect(vars["--accent-soft"]).toContain("255, 255, 255");
  });
});
