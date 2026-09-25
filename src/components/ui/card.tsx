import { cx } from "@/lib/cx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds hover elevation + focus-visible support for clickable cards. */
  interactive?: boolean;
}

/**
 * Base surface for grouped content — team cards, captain cards, stat
 * panels. Elevation is dark-on-dark (inset top highlight + soft shadow),
 * not a grey drop shadow.
 */
export function Card({ interactive, className, tabIndex, ...props }: CardProps) {
  return (
    <div
      tabIndex={interactive ? (tabIndex ?? 0) : tabIndex}
      className={cx(
        "rounded-md border border-arena-line bg-arena-charcoal p-6 shadow-card",
        interactive &&
          "cursor-pointer transition-[transform,box-shadow,border-color] duration-200 " +
            "hover:-translate-y-1 hover:border-arena-line-strong hover:shadow-elevated",
        className
      )}
      {...props}
    />
  );
}
