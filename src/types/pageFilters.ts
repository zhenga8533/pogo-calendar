// Page-specific filter types

// Egg Pool Filters
export interface EggPoolFilters {
  pokemonSearch: string;
  selectedEggTiers: string[];
  selectedRarityTiers: string[];
  shinyOnly: boolean;
}

// Raid Boss Filters
export interface RaidBossFilters {
  pokemonSearch: string;
  selectedRaidTiers: string[];
  selectedTypes: string[];
  shinyOnly: boolean;
  minCP: number;
  maxCP: number;
}

// Research Task Filters
export interface ResearchTaskFilters {
  taskSearch: string;
  pokemonSearch: string;
  rewardTypes: string[]; // 'encounter' | 'item'
  shinyOnly: boolean;
  selectedCategories: string[];
}

// Rocket Lineup Filters
export interface RocketLineupFilters {
  pokemonSearch: string;
  selectedLeaders: string[];
  selectedSlots: number[];
  encounterOnly: boolean;
  shinyOnly: boolean;
}

// Union type for all page filters
export type PageFilters =
  | EggPoolFilters
  | RaidBossFilters
  | ResearchTaskFilters
  | RocketLineupFilters;

// Page identifier
export type PageType =
  | 'calendar'
  | 'egg-pool'
  | 'raid-bosses'
  | 'research-tasks'
  | 'rocket-lineup'
  | 'faq';
