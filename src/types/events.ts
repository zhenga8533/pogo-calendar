// A Pokemon entry within an event's details (e.g. spawns, raids, shiny).
// `asset_url` may be null if the sprite couldn't be resolved when scraped.
export interface EventPokemon {
  name: string;
  asset_url: string | null;
  shiny_available: boolean;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  extendedProps: {
    category: string;
    article_url: string;
    banner_url: string;
    description?: string;
    bonuses?: string[];
    // All other fields are Pokemon lists.
    [key: string]: string | string[] | EventPokemon[] | undefined;
  };
}

export interface ApiEvent {
  title: string;
  category: string;
  is_local_time: boolean;
  start_time: string | number;
  end_time: string | number;
  article_url: string;
  banner_url: string;
  description?: string;
  details?: {
    bonuses?: string[];
    // All other fields (spawns, raids, shiny, features, eggs, moves) are Pokemon lists.
    [key: string]: string[] | EventPokemon[] | undefined;
  };
}

export type NewEventData = {
  title: string;
  start: string;
  end: string;
};

/**
 * Returns the display name for a Pokemon-list entry, which may be a plain
 * name string (legacy format) or an EventPokemon object (current format).
 */
export function getPokemonName(item: string | EventPokemon): string {
  return typeof item === 'string' ? item : item.name;
}
