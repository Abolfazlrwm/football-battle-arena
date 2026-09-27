import type { Captain } from "@/types";
import { captainPortraitImage } from "./images";
import { getTeamById } from "./teams";

/**
 * One captain per launch club, matching each team's `captainId`.
 *
 * IMPORTANT: captaincies change season to season (armbands get
 * reassigned after departures, injuries, or a new manager's decision).
 * Each of these was checked against current reporting for the 2026/27
 * season rather than assumed from memory — see the master spec's
 * INITIAL TEAMS note. If a captain has changed since, update the
 * `position`/`number`/`nationality` fields here; nothing elsewhere in
 * the app hard-codes a captain's name.
 *
 * `rating` and `stats` are the arena's own illustrative attribute
 * ratings (see the CaptainStats type doc) — not an official FIFA-style
 * rating.
 */
function captain(c: Omit<Captain, "image">): Captain {
  const team = getTeamById(c.teamId);
  if (!team) throw new Error(`captains.ts: unknown teamId "${c.teamId}"`);
  return { ...c, image: captainPortraitImage(c, team) };
}

export const captains: Captain[] = [
  captain({
    id: "federico-valverde",
    slug: "federico-valverde",
    name: "Federico Valverde",
    teamId: "real-madrid",
    position: "Midfielder",
    number: 8,
    nationality: "Uruguay",
    rating: 88,
    stats: { pace: 87, shooting: 78, passing: 84, dribbling: 82, defending: 76, physical: 85 },
    bio: "A box-to-box engine who took on the captaincy after Dani Carvajal's departure, as comfortable breaking up play as driving forward with it.",
  }),
  captain({
    id: "raphinha",
    slug: "raphinha",
    name: "Raphinha",
    teamId: "barcelona",
    position: "Forward",
    number: 11,
    nationality: "Brazil",
    rating: 89,
    stats: { pace: 88, shooting: 85, passing: 83, dribbling: 87, defending: 45, physical: 72 },
    bio: "Named Barcelona's captain for 2026/27, the first Brazilian to hold the role at the club — a direct, high-volume attacker on the left flank.",
  }),
  captain({
    id: "ruben-dias",
    slug: "ruben-dias",
    name: "Rúben Dias",
    teamId: "manchester-city",
    position: "Defender",
    number: 3,
    nationality: "Portugal",
    rating: 87,
    stats: { pace: 72, shooting: 45, passing: 76, dribbling: 62, defending: 90, physical: 86 },
    bio: "A commanding, vocal centre-back who took over the armband as Manchester City rebuilt its leadership group in 2026.",
  }),
  captain({
    id: "virgil-van-dijk",
    slug: "virgil-van-dijk",
    name: "Virgil van Dijk",
    teamId: "liverpool",
    position: "Defender",
    number: 4,
    nationality: "Netherlands",
    rating: 89,
    stats: { pace: 78, shooting: 52, passing: 80, dribbling: 68, defending: 91, physical: 88 },
    bio: "Liverpool's captain since 2023, and still the defensive foundation the team is built around under a new head coach.",
  }),
  captain({
    id: "martin-odegaard",
    slug: "martin-odegaard",
    name: "Martin Ødegaard",
    teamId: "arsenal",
    position: "Midfielder",
    number: 8,
    nationality: "Norway",
    rating: 87,
    stats: { pace: 74, shooting: 80, passing: 89, dribbling: 85, defending: 55, physical: 68 },
    bio: "Arsenal's captain since 2022 and its creative focal point, retained the armband for 2026/27 after a squad vote.",
  }),
  captain({
    id: "bruno-fernandes",
    slug: "bruno-fernandes",
    name: "Bruno Fernandes",
    teamId: "manchester-united",
    position: "Midfielder",
    number: 8,
    nationality: "Portugal",
    rating: 86,
    stats: { pace: 70, shooting: 83, passing: 88, dribbling: 80, defending: 58, physical: 70 },
    bio: "Manchester United's captain and talisman, a set-piece and chance-creation focal point since taking the armband in 2023.",
  }),
  captain({
    id: "manuel-neuer",
    slug: "manuel-neuer",
    name: "Manuel Neuer",
    teamId: "bayern-munich",
    position: "Goalkeeper",
    number: 1,
    nationality: "Germany",
    rating: 85,
    stats: { pace: 55, shooting: 30, passing: 78, dribbling: 60, defending: 88, physical: 80 },
    bio: "Bayern's captain since 2017 and one of the position's defining modern goalkeepers, still first choice heading into 2026/27.",
  }),
  captain({
    id: "emre-can",
    slug: "emre-can",
    name: "Emre Can",
    teamId: "borussia-dortmund",
    position: "Midfielder",
    number: 23,
    nationality: "Germany",
    rating: 82,
    stats: { pace: 68, shooting: 65, passing: 78, dribbling: 70, defending: 82, physical: 84 },
    bio: "Dortmund's captain since 2023, a versatile midfielder-defender who leads the side through a lengthy injury recovery.",
  }),
  captain({
    id: "lautaro-martinez",
    slug: "lautaro-martinez",
    name: "Lautaro Martínez",
    teamId: "inter-milan",
    position: "Forward",
    number: 10,
    nationality: "Argentina",
    rating: 89,
    stats: { pace: 82, shooting: 89, passing: 74, dribbling: 83, defending: 40, physical: 78 },
    bio: "Inter's captain and top scorer, the focal point of the attack that carried the club to the 2025/26 Serie A title.",
  }),
  captain({
    id: "mike-maignan",
    slug: "mike-maignan",
    name: "Mike Maignan",
    teamId: "ac-milan",
    position: "Goalkeeper",
    number: 16,
    nationality: "France",
    rating: 86,
    stats: { pace: 60, shooting: 32, passing: 80, dribbling: 62, defending: 87, physical: 82 },
    bio: "AC Milan's captain and undisputed number one, a commanding shot-stopper equally comfortable playing out from the back.",
  }),
  captain({
    id: "marquinhos",
    slug: "marquinhos",
    name: "Marquinhos",
    teamId: "psg",
    position: "Defender",
    number: 5,
    nationality: "Brazil",
    rating: 87,
    stats: { pace: 74, shooting: 48, passing: 80, dribbling: 68, defending: 88, physical: 82 },
    bio: "PSG's long-serving captain, the club's all-time appearance leader and the defender who lifted back-to-back Champions League titles.",
  }),
  captain({
    id: "manuel-locatelli",
    slug: "manuel-locatelli",
    name: "Manuel Locatelli",
    teamId: "juventus",
    position: "Midfielder",
    number: 5,
    nationality: "Italy",
    rating: 83,
    stats: { pace: 62, shooting: 68, passing: 85, dribbling: 74, defending: 78, physical: 76 },
    bio: "A boyhood Juventus fan turned club captain, the deep-lying midfielder who controls tempo from the base of the team.",
  }),
];

export function getCaptainById(id: string): Captain | undefined {
  return captains.find((c) => c.id === id);
}

export function getCaptainBySlug(slug: string): Captain | undefined {
  return captains.find((c) => c.slug === slug);
}

export function getCaptainByTeamId(teamId: string): Captain | undefined {
  return captains.find((c) => c.teamId === teamId);
}
