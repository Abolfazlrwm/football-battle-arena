import { describe, expect, it } from "vitest";
import { cx } from "@/lib/cx";

describe("cx", () => {
  it("joins truthy class names with spaces", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });

  it("drops false, null, undefined and empty strings", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when everything is filtered out", () => {
    expect(cx(false, null, undefined, "")).toBe("");
  });
});
