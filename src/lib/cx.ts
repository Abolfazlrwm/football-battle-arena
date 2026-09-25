/**
 * Minimal classname combiner — avoids pulling in clsx/tailwind-merge for
 * something this small. Falsy values (false, null, undefined, "") are
 * dropped so conditional classes can be written inline.
 */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
