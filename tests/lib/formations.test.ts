import { describe, expect, it } from "vitest";
import { FORMATION_BLURBS, FORMATION_LAYOUTS, captainSlotIndex } from "@/lib/formations";

const FORMATIONS = Object.keys(FORMATION_LAYOUTS) as Array<keyof typeof FORMATION_LAYOUTS>;

/** Category counts per formation — how the digits of "4-3-3" etc. map to slots. */
const CATEGORY_COUNTS: Record<string, { GK: number; DEF: number; MID: number; FWD: number }> = {
  "4-3-3": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "4-2-3-1": { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  "4-4-2": { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  "3-5-2": { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  "3-4-3": { GK: 1, DEF: 3, MID: 4, FWD: 3 },
};

describe("FORMATION_LAYOUTS", () => {
  it("gives every formation exactly eleven slots inside the pitch", () => {
    for (const formation of FORMATIONS) {
      const slots = FORMATION_LAYOUTS[formation];
      expect(slots, formation).toHaveLength(11);
      for (const slot of slots) {
        expect(slot.x).toBeGreaterThanOrEqual(0);
        expect(slot.x).toBeLessThanOrEqual(100);
        expect(slot.y).toBeGreaterThanOrEqual(0);
        expect(slot.y).toBeLessThanOrEqual(100);
      }
    }
  });

  it("matches each formation's digits with its category counts", () => {
    for (const formation of FORMATIONS) {
      const slots = FORMATION_LAYOUTS[formation];
      for (const category of ["GK", "DEF", "MID", "FWD"] as const) {
        const actual = slots.filter((s) => s.category === category).length;
        expect(actual, `${formation} ${category}`).toBe(CATEGORY_COUNTS[formation][category]);
      }
    }
  });

  it("fields exactly one goalkeeper, on the goal line, down the middle", () => {
    for (const formation of FORMATIONS) {
      const keepers = FORMATION_LAYOUTS[formation].filter((s) => s.category === "GK");
      expect(keepers, formation).toHaveLength(1);
      expect(keepers[0]).toMatchObject({ role: "GK", x: 50 });
    }
  });

  it("documents every formation with a non-empty blurb", () => {
    expect(Object.keys(FORMATION_BLURBS).sort()).toEqual(FORMATIONS.sort());
    for (const blurb of Object.values(FORMATION_BLURBS)) {
      expect(blurb.length).toBeGreaterThan(20);
    }
  });
});

describe("captainSlotIndex", () => {
  it("always puts a goalkeeper between the posts", () => {
    for (const formation of FORMATIONS) {
      const index = captainSlotIndex(formation, "Goalkeeper");
      expect(FORMATION_LAYOUTS[formation][index].role, formation).toBe("GK");
    }
  });

  it("matches slots to the position group with no hint", () => {
    expect(FORMATION_LAYOUTS["4-3-3"][captainSlotIndex("4-3-3", "Forward")].role).toBe("ST");
    expect(FORMATION_LAYOUTS["4-3-3"][captainSlotIndex("4-3-3", "Midfielder")].role).toBe("CM");
    expect(FORMATION_LAYOUTS["4-3-3"][captainSlotIndex("4-3-3", "Defender")].role).toBe("CB");
  });

  it("takes the deepest slot for the 'deep' hint", () => {
    expect(FORMATION_LAYOUTS["4-3-3"][captainSlotIndex("4-3-3", "Defender", "deep")].role).toBe("CB");
    expect(FORMATION_LAYOUTS["4-2-3-1"][captainSlotIndex("4-2-3-1", "Midfielder", "deep")].role).toBe("CDM");
  });

  it("takes the most advanced central slot for the 'attacking' hint", () => {
    // CAM (y=60, central) beats the CDMs (y=40) — a #10 isn't a holding midfielder.
    expect(FORMATION_LAYOUTS["4-2-3-1"][captainSlotIndex("4-2-3-1", "Midfielder", "attacking")].role).toBe("CAM");
    expect(FORMATION_LAYOUTS["4-3-3"][captainSlotIndex("4-3-3", "Forward", "attacking")].role).toBe("ST");
  });

  it("respects the wide hints on the correct flank", () => {
    const slots = FORMATION_LAYOUTS["4-3-3"];
    expect(slots[captainSlotIndex("4-3-3", "Forward", "wide-left")].role).toBe("LW");
    expect(slots[captainSlotIndex("4-3-3", "Forward", "wide-right")].role).toBe("RW");
    expect(["LW", "RW"]).toContain(slots[captainSlotIndex("4-3-3", "Forward", "wide")].role);
    // 'wide' prefers a flank over the central striker.
    expect(slots[captainSlotIndex("4-3-3", "Forward", "wide")].role).not.toBe("ST");
  });

  it("always returns a valid index into the formation", () => {
    for (const formation of FORMATIONS) {
      for (const position of ["Goalkeeper", "Defender", "Midfielder", "Forward"] as const) {
        const index = captainSlotIndex(formation, position);
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(11);
      }
    }
  });
});
