export type RankingRegion =
  | "Europe"
  | "England"
  | "Spain"
  | "Germany"
  | "Italy"
  | "France";

export interface RankingEntry {
  rank: number;
  teamId: string;
  region: RankingRegion;
}
