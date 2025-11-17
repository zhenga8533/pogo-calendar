export interface RocketPokemon {
  name: string;
  shiny_available: boolean;
  asset_url: string;
}

export interface RocketSlot {
  slot: number;
  pokemons: RocketPokemon[];
  is_encounter: boolean;
}

export interface RocketLineupData {
  [leader: string]: RocketSlot[];
}

export type RocketLeader = 'Giovanni' | 'Cliff' | 'Sierra' | 'Arlo';
