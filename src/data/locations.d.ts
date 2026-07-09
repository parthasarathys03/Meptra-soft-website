export interface LocationContent {
  slug: string;
  /** District / city name. */
  city: string;
  region: string;
  /** Grouping zone for the index page. */
  zone: string;
  /** Unique one-line intro. */
  lead: string;
  /** Unique one-line note on the local education/economy scene. */
  highlight: string;
  industries: string[];
  colleges: string[];
  universities: string[];
  nearby: string[];
}

export const locations: LocationContent[];
export const zones: string[];
export function getLocation(slug: string): LocationContent | undefined;
