import type { Team } from "@/types";
import { teamHeroImage, teamLogoImage } from "./images";

/**
 * The 12 launch clubs (see the master spec's INITIAL TEAMS list),
 * spanning five leagues. Colors, stadiums, founding years and captain
 * assignments were checked against current sources rather than assumed
 * from memory, since captaincies and squad details change season to
 * season — see /data/captains.ts for the same note.
 *
 * `stats` and `trophies` are the arena's own illustrative comparison
 * figures (see the TeamStats and Team type docs) — not an official
 * ranking.
 */
function team(t: Omit<Team, "logo" | "heroImage">): Team {
  return { ...t, logo: teamLogoImage(t), heroImage: teamHeroImage(t) };
}

export const teams: Team[] = [
  team({
    id: "real-madrid",
    slug: "real-madrid",
    name: "Real Madrid",
    shortName: "Real Madrid",
    country: "Spain",
    league: "La Liga",
    founded: 1902,
    stadium: "Santiago Bernabéu",
    colors: { primary: "#FFFFFF", secondary: "#1E3A8A" },
    captainId: "federico-valverde",
    stats: { overall: 90, attack: 92, midfield: 87, defense: 85 },
    trophies: 100,
    description:
      "The most decorated club in European football, built on a relentless expectation of winning every competition it enters.",
  }),
  team({
    id: "barcelona",
    slug: "barcelona",
    name: "Barcelona",
    shortName: "Barcelona",
    country: "Spain",
    league: "La Liga",
    founded: 1899,
    stadium: "Camp Nou",
    colors: { primary: "#A50044", secondary: "#004D98" },
    captainId: "raphinha",
    stats: { overall: 91, attack: 93, midfield: 90, defense: 82 },
    trophies: 99,
    description:
      "A club defined by its academy and its philosophy — possession-based football built around technical, homegrown talent.",
  }),
  team({
    id: "manchester-city",
    slug: "manchester-city",
    name: "Manchester City",
    shortName: "Man City",
    country: "England",
    league: "Premier League",
    founded: 1880,
    stadium: "Etihad Stadium",
    colors: { primary: "#6CABDD", secondary: "#1C2C5B" },
    captainId: "ruben-dias",
    stats: { overall: 89, attack: 88, midfield: 90, defense: 86 },
    trophies: 36,
    description:
      "The dominant English side of the past decade, entering a new era after a summer of major changes to squad and staff.",
  }),
  team({
    id: "liverpool",
    slug: "liverpool",
    name: "Liverpool",
    shortName: "Liverpool",
    country: "England",
    league: "Premier League",
    founded: 1892,
    stadium: "Anfield",
    colors: { primary: "#C8102E", secondary: "#1A1A1A" },
    captainId: "virgil-van-dijk",
    stats: { overall: 88, attack: 87, midfield: 85, defense: 87 },
    trophies: 97,
    description:
      "One of the most storied names in the game, with a fan culture and an anthem as recognizable as its trophy cabinet.",
  }),
  team({
    id: "arsenal",
    slug: "arsenal",
    name: "Arsenal",
    shortName: "Arsenal",
    country: "England",
    league: "Premier League",
    founded: 1886,
    stadium: "Emirates Stadium",
    colors: { primary: "#EF0107", secondary: "#023474" },
    captainId: "martin-odegaard",
    stats: { overall: 87, attack: 85, midfield: 88, defense: 86 },
    trophies: 48,
    description:
      "North London's standard-bearer, rebuilt around a possession-heavy, high-pressing identity and a settled young core.",
  }),
  team({
    id: "manchester-united",
    slug: "manchester-united",
    name: "Manchester United",
    shortName: "Man United",
    country: "England",
    league: "Premier League",
    founded: 1878,
    stadium: "Old Trafford",
    colors: { primary: "#DA291C", secondary: "#FBE122" },
    captainId: "bruno-fernandes",
    stats: { overall: 82, attack: 83, midfield: 80, defense: 78 },
    trophies: 68,
    description:
      "English football's most globally recognized club, still measuring every season against its own long history of success.",
  }),
  team({
    id: "bayern-munich",
    slug: "bayern-munich",
    name: "Bayern Munich",
    shortName: "Bayern",
    country: "Germany",
    league: "Bundesliga",
    founded: 1900,
    stadium: "Allianz Arena",
    colors: { primary: "#DC052D", secondary: "#0066B2" },
    captainId: "manuel-neuer",
    stats: { overall: 89, attack: 90, midfield: 86, defense: 85 },
    trophies: 84,
    description:
      "The dominant force in German football for two decades, built on squad continuity and a consistently ruthless standard.",
  }),
  team({
    id: "borussia-dortmund",
    slug: "borussia-dortmund",
    name: "Borussia Dortmund",
    shortName: "Dortmund",
    country: "Germany",
    league: "Bundesliga",
    founded: 1909,
    stadium: "Signal Iduna Park",
    colors: { primary: "#FDE100", secondary: "#000000" },
    captainId: "emre-can",
    stats: { overall: 82, attack: 84, midfield: 80, defense: 76 },
    trophies: 24,
    description:
      "Home to the loudest terrace in world football, the Yellow Wall, and a long track record of developing elite young talent.",
  }),
  team({
    id: "inter-milan",
    slug: "inter-milan",
    name: "Inter Milan",
    shortName: "Inter",
    country: "Italy",
    league: "Serie A",
    founded: 1908,
    stadium: "San Siro",
    colors: { primary: "#010E80", secondary: "#000000" },
    captainId: "lautaro-martinez",
    stats: { overall: 87, attack: 86, midfield: 85, defense: 88 },
    trophies: 46,
    description:
      "Italy's reigning champions, known for defensive discipline and a nerazzurri identity that spans over a century.",
  }),
  team({
    id: "ac-milan",
    slug: "ac-milan",
    name: "AC Milan",
    shortName: "AC Milan",
    country: "Italy",
    league: "Serie A",
    founded: 1899,
    stadium: "San Siro",
    colors: { primary: "#FB090B", secondary: "#000000" },
    captainId: "mike-maignan",
    stats: { overall: 84, attack: 83, midfield: 82, defense: 84 },
    trophies: 50,
    description:
      "Seven-time European champions sharing San Siro with their fiercest rivals, rebuilding around a new coaching project.",
  }),
  team({
    id: "psg",
    slug: "psg",
    name: "Paris Saint-Germain",
    shortName: "PSG",
    country: "France",
    league: "Ligue 1",
    founded: 1970,
    stadium: "Parc des Princes",
    colors: { primary: "#004170", secondary: "#DA291C" },
    captainId: "marquinhos",
    stats: { overall: 90, attack: 92, midfield: 87, defense: 83 },
    trophies: 50,
    description:
      "The dominant club in French football, now a back-to-back European champion under a settled, star-studded core.",
  }),
  team({
    id: "juventus",
    slug: "juventus",
    name: "Juventus",
    shortName: "Juventus",
    country: "Italy",
    league: "Serie A",
    founded: 1897,
    stadium: "Allianz Stadium",
    colors: { primary: "#000000", secondary: "#FFFFFF" },
    captainId: "manuel-locatelli",
    stats: { overall: 83, attack: 80, midfield: 82, defense: 85 },
    trophies: 70,
    description:
      "Italy's most decorated club, the Old Lady, built on a defensive tradition it has carried across generations.",
  }),
];

export function getTeamBySlug(slug: string): Team | undefined {
  return teams.find((t) => t.slug === slug);
}

export function getTeamById(id: string): Team | undefined {
  return teams.find((t) => t.id === id);
}
