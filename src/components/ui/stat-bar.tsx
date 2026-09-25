import { cx } from "@/lib/cx";

export interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  /** Use the team accent for the fill instead of neutral fog. */
  accent?: boolean;
  showValue?: boolean;
  className?: string;
}

/**
 * Labeled progress track for ratings and comparisons (attack, defense,
 * midfield, ...). Width transitions on change — respects
 * prefers-reduced-motion via the global rule in globals.css. The number
 * animation (counting up) is added when this is wired to real data in a
 * later phase; this is the static, reusable visual primitive.
 */
export function StatBar({
  label,
  value,
  max = 100,
  accent = false,
  showValue = true,
  className,
}: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cx("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between font-body text-label text-arena-mist">
        <span>{label}</span>
        {showValue && <span className="text-arena-fog">{value}</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-2 w-full overflow-hidden rounded-full bg-arena-charcoal-raised"
      >
        <div
          className={cx(
            "h-full rounded-full transition-[width] duration-500 ease-out",
            accent ? "bg-accent" : "bg-arena-fog/70"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
