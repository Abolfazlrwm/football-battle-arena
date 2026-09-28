import type { TeamColors } from "@/types";

/**
 * Turns a team's brand colors into a usable --accent system (see the
 * accent architecture in globals.css from Phase 02). Real club colors
 * vary wildly in lightness — Real Madrid's primary is white, Juventus's
 * is black, Inter's is a near-black navy — so picking the "wrong" one
 * verbatim can produce an accent that's invisible against the arena's
 * near-black page background. This file makes that choice automatically
 * instead of hand-tuning every team.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Perceptual (weighted) luminance, 0 (black) – 1 (white). */
function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case rN:
      h = (gN - bN) / d + (gN < bN ? 6 : 0);
      break;
    case gN:
      h = (bN - rN) / d + 2;
      break;
    default:
      h = (rN - gN) / d + 4;
  }
  return { h: h * 60, s, l };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hh = h / 360;
  return {
    r: hue2rgb(p, q, hh + 1 / 3) * 255,
    g: hue2rgb(p, q, hh) * 255,
    b: hue2rgb(p, q, hh - 1 / 3) * 255,
  };
}

/** Nudges lightness by `deltaPct` percentage points (can be negative). */
function adjustLightness(hex: string, deltaPct: number): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  const l = Math.min(1, Math.max(0, hsl.l + deltaPct / 100));
  return rgbToHex(hslToRgb({ ...hsl, l }));
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Near-black colors read as invisible against the arena's #07070a page. */
const MIN_USABLE_LUMINANCE = 0.12;

/**
 * Picks whichever of a team's two colors will actually read as an
 * accent on a near-black page, preferring `primary` (a club's colors
 * are usually listed with its true identity color first). If both are
 * too dark, the primary hue is lightened just enough to clear the
 * threshold rather than falling back to a generic, unbranded color.
 */
function pickAccentBase(colors: TeamColors): string {
  if (luminance(colors.primary) >= MIN_USABLE_LUMINANCE) return colors.primary;
  if (luminance(colors.secondary) >= MIN_USABLE_LUMINANCE) return colors.secondary;
  let lifted = colors.primary;
  let guard = 0;
  while (luminance(lifted) < MIN_USABLE_LUMINANCE && guard < 20) {
    lifted = adjustLightness(lifted, 5);
    guard += 1;
  }
  return lifted;
}

export interface AccentVars {
  "--accent": string;
  "--accent-strong": string;
  "--accent-soft": string;
  "--accent-contrast": string;
}

/**
 * Builds the four custom properties the design system's accent
 * architecture expects (see globals.css). Spread the result onto a
 * `style` prop — everything using bg-accent / text-accent / etc.
 * re-themes through the cascade automatically.
 */
export function buildAccentVars(colors: TeamColors): AccentVars {
  const accent = pickAccentBase(colors);
  const isLight = luminance(accent) > 0.6;
  return {
    "--accent": accent,
    "--accent-strong": adjustLightness(accent, isLight ? -10 : 12),
    "--accent-soft": withAlpha(accent, 0.14),
    "--accent-contrast": luminance(accent) > 0.55 ? "#04070f" : "#ffffff",
  };
}
