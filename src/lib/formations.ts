import type { CaptainPosition, CaptainRoleHint, Formation } from "@/types";

/**
 * Tactical pitch geometry. Coordinates are percentages of the pitch:
 * x runs left → right, y runs from the team's own goal line (0) up
 * toward the opponent's goal (100). Formations are generic, public
 * football concepts — nothing here is tied to any real team sheet.
 */

export type SlotCategory = "GK" | "DEF" | "MID" | "FWD";

export interface FormationSlot {
  role: string;
  roleName: string;
  category: SlotCategory;
  x: number;
  y: number;
}

const GK: FormationSlot = { role: "GK", roleName: "Goalkeeper", category: "GK", x: 50, y: 7 };
const LB: FormationSlot = { role: "LB", roleName: "Left-Back", category: "DEF", x: 14, y: 24 };
const RB: FormationSlot = { role: "RB", roleName: "Right-Back", category: "DEF", x: 86, y: 24 };
const CBL: FormationSlot = { role: "CB", roleName: "Centre-Back", category: "DEF", x: 37, y: 19 };
const CBR: FormationSlot = { role: "CB", roleName: "Centre-Back", category: "DEF", x: 63, y: 19 };
const CB3 = (x: number, y: number): FormationSlot => ({ role: "CB", roleName: "Centre-Back", category: "DEF", x, y });
const CM = (x: number, y: number): FormationSlot => ({ role: "CM", roleName: "Central Midfield", category: "MID", x, y });
const CDM = (x: number): FormationSlot => ({ role: "CDM", roleName: "Defensive Midfield", category: "MID", x, y: 40 });
const WING = (role: string, roleName: string, side: "L" | "R", y: number): FormationSlot => ({
  role, roleName, category: "FWD", x: side === "L" ? 17 : 83, y,
});
const ST = (x: number, y: number): FormationSlot => ({ role: "ST", roleName: "Striker", category: "FWD", x, y });

export const FORMATION_LAYOUTS: Record<Formation, FormationSlot[]> = {
  "4-3-3": [
    GK, LB, CBL, CBR, RB,
    CM(28, 46), CM(50, 41), CM(72, 46),
    WING("LW", "Left Winger", "L", 76), ST(50, 84), WING("RW", "Right Winger", "R", 76),
  ],
  "4-2-3-1": [
    GK, LB, CBL, CBR, RB,
    CDM(36), CDM(64),
    WING("LW", "Left Winger", "L", 62),
    { role: "CAM", roleName: "Attacking Midfield", category: "MID", x: 50, y: 60 },
    WING("RW", "Right Winger", "R", 62),
    ST(50, 85),
  ],
  "4-4-2": [
    GK, LB, CBL, CBR, RB,
    { role: "LM", roleName: "Left Midfield", category: "MID", x: 14, y: 50 },
    CM(38, 46), CM(62, 46),
    { role: "RM", roleName: "Right Midfield", category: "MID", x: 86, y: 50 },
    ST(38, 82), ST(62, 82),
  ],
  "3-5-2": [
    GK, CB3(28, 20), CB3(50, 16), CB3(72, 20),
    { role: "LWB", roleName: "Left Wing-Back", category: "MID", x: 9, y: 46 },
    CM(32, 46), CM(50, 41), CM(68, 46),
    { role: "RWB", roleName: "Right Wing-Back", category: "MID", x: 91, y: 46 },
    ST(38, 82), ST(62, 82),
  ],
  "3-4-3": [
    GK, CB3(28, 20), CB3(50, 16), CB3(72, 20),
    { role: "LM", roleName: "Left Midfield", category: "MID", x: 14, y: 46 },
    CM(38, 43), CM(62, 43),
    { role: "RM", roleName: "Right Midfield", category: "MID", x: 86, y: 46 },
    WING("LW", "Left Winger", "L", 76), ST(50, 84), WING("RW", "Right Winger", "R", 76),
  ],
};

export const FORMATION_BLURBS: Record<Formation, string> = {
  "4-3-3": "Back four, three central midfielders, and two wide forwards either side of a lone striker.",
  "4-2-3-1": "Back four, a double pivot, three attacking midfielders, and a lone striker.",
  "4-4-2": "Two flat banks of four with a strike partnership up front.",
  "3-5-2": "Three centre-backs, wing-backs providing the width, and two strikers.",
  "3-4-3": "Three at the back, a midfield four, and an aggressive front three.",
};

function categoryFor(position: CaptainPosition): SlotCategory {
  switch (position) {
    case "Goalkeeper":
      return "GK";
    case "Defender":
      return "DEF";
    case "Midfielder":
      return "MID";
    default:
      return "FWD";
  }
}

/**
 * Which slot the captain occupies, matched on his real position group
 * (goalkeeper → GK, defender → back line, …) and nudged by an optional
 * role hint: "deep" prefers the deepest slot, "attacking" the most
 * advanced central slot, "wide" the widest, "wide-left" / "wide-right" the widest on that side. With no hint the most central slot wins.
 */
export function captainSlotIndex(
  formation: Formation,
  position: CaptainPosition,
  hint?: CaptainRoleHint
): number {
  const slots = FORMATION_LAYOUTS[formation];
  const category = categoryFor(position);
  const candidates = slots
    .map((slot, index) => ({ slot, index }))
    .filter(({ slot }) => slot.category === category);
  if (candidates.length === 0) return 0;

  const centrality = (x: number) => Math.abs(x - 50);
  candidates.sort((a, b) => {
    if (hint === "deep") return a.slot.y - b.slot.y || centrality(a.slot.x) - centrality(b.slot.x);
    if (hint === "attacking") {
      // most advanced, but central slots beat wide ones (a #10 isn't a left midfielder)
      const score = (c: { slot: FormationSlot }) => c.slot.y - 0.35 * centrality(c.slot.x);
      return score(b) - score(a);
    }
    if (hint === "wide") return centrality(b.slot.x) - centrality(a.slot.x);
    if (hint === "wide-left") return a.slot.x - b.slot.x;
    if (hint === "wide-right") return b.slot.x - a.slot.x;
    return centrality(a.slot.x) - centrality(b.slot.x);
  });
  return candidates[0].index;
}
