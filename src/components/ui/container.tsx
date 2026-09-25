import { cx } from "@/lib/cx";

export type ContainerSize = "content" | "wide" | "narrow";

const sizeClass: Record<ContainerSize, string> = {
  content: "arena-container", // 1200px — default page content
  wide: "arena-container-wide", // 1440px — full-bleed hero/cinematic sections
  narrow: "arena-container-narrow", // 720px — text-heavy content
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  as?: React.ElementType;
}

/** Centers content at one of three standard max-widths (see globals.css). */
export function Container({
  size = "content",
  as: Component = "div",
  className,
  ...props
}: ContainerProps) {
  return <Component className={cx(sizeClass[size], className)} {...props} />;
}
