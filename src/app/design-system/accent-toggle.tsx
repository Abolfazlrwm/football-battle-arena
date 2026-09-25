"use client";

import { useState } from "react";
import { Badge, Button, StatBar } from "@/components/ui";
import { cx } from "@/lib/cx";

const palettes = [
  { key: undefined, label: "Default" },
  { key: "ember", label: "Ember" },
  { key: "glacier", label: "Glacier" },
  { key: "verdant", label: "Verdant" },
] as const;

/**
 * Proves the team-accent architecture: every primitive below reads the
 * --accent custom property, so flipping `data-accent` on the wrapping
 * panel re-themes them instantly — no component re-render, no prop
 * threading. This is the mechanism a future team selector will drive.
 */
export function AccentToggleDemo() {
  const [active, setActive] = useState<(typeof palettes)[number]["key"]>(undefined);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {palettes.map((p) => (
          <button
            key={p.label}
            onClick={() => setActive(p.key)}
            className={cx(
              "rounded-sm border px-3.5 py-1.5 font-body text-body-sm transition-colors",
              active === p.key
                ? "border-arena-line-strong bg-arena-charcoal-raised text-arena-fog"
                : "border-arena-line bg-transparent text-arena-mist hover:text-arena-fog"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        data-accent={active}
        className="grid gap-6 rounded-lg border border-arena-line bg-arena-navy p-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-3">
          <Button variant="primary">Enter arena</Button>
          <Badge variant="accent">Captain</Badge>
        </div>
        <StatBar label="Attack" value={82} accent showValue />
      </div>
    </div>
  );
}
