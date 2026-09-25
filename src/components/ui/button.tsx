import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-body font-semibold " +
  "rounded-sm transition-[background-color,border-color,box-shadow,transform] duration-150 " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-40 disabled:active:translate-y-0";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-contrast hover:bg-accent-strong hover:shadow-glow-accent",
  secondary:
    "bg-arena-charcoal text-arena-fog border border-arena-line " +
    "hover:border-arena-line-strong hover:bg-arena-charcoal-raised",
  ghost: "bg-transparent text-arena-fog hover:bg-arena-charcoal",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-body-sm gap-1.5",
  md: "h-11 px-5 text-body gap-2",
  lg: "h-12 px-7 text-body-lg gap-2.5",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cx(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Primary interactive control. Three variants (primary / secondary / ghost)
 * covering CTA hierarchy, three sizes. Hover, active (press), focus-visible
 * (global accent ring, see globals.css) and disabled states are all built in.
 *
 * For a link that should look like a button (e.g. a Next.js <Link>), use
 * the exported `buttonStyles()` helper on the link element directly rather
 * than nesting an anchor inside this button.
 */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
