export type RankingRegion =
  | "Europe"
  | "England"
  | "Spain"
  | "Germany"
  | "Italy"
  | "France"
  | "Portugal";

export interface RankingEntry {
  rank: number;
  teamId: string;
  region: RankingRegion;
}
