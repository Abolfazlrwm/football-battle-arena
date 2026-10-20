# Team logos

One file per team, named exactly after its slug, as a **256×256 transparent WebP**:

```
real-madrid.webp         manchester-city.webp     bayern-munich.webp
barcelona.webp           liverpool.webp           borussia-dortmund.webp
arsenal.webp             manchester-united.webp   inter-milan.webp
ac-milan.webp            psg.webp                 juventus.webp
```

`TeamLogo` (src/components/teams/team-logo.tsx) loads `/logos/{slug}.webp` and
automatically falls back to the generated `TeamCrest` badge if a file is missing,
so you can add or replace logos one at a time.

## Adding / replacing a logo

Best source: a transparent PNG or SVG (e.g. from the club's media kit or Wikimedia
Commons). Avoid images saved from a search page — those often have a fake
grey/white checkerboard "transparency" baked into the pixels.

Target: square canvas, logo centred with a little padding, transparent background,
256px, WebP quality ~85 → usually 7–25 KB.

Free converter (no install): https://squoosh.app → resize to 256, choose WebP.
