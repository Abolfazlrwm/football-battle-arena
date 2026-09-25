import { cx } from "@/lib/cx";

export type BadgeVariant = "neutral" | "accent" | "outline";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-arena-charcoal-raised text-arena-mist border border-arena-line",
  accent: "bg-accent-soft text-accent border border-transparent",
  outline: "bg-transparent text-arena-fog border border-arena-line-strong",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/**
 * Small metadata chip — league, position, rating context, status.
 * Case is left to the caller: real football abbreviations (GK, MF, 2026)
 * are meaningful as-is and shouldn't be forced through a text-transform.
 */
export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5",
        "font-body text-label",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
