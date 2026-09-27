export interface Battle {
  id: string;
  slug: string;
  teamAId: string;
  teamBId: string;
  /** Short framing line, e.g. "El Clásico". Not a real match prediction. */
  tagline: string;
  featured: boolean;
}
