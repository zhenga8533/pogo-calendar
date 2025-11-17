export interface EggPokemon {
  name: string;
  shiny_available: boolean;
  asset_url: string;
  hatch_distance: number;
  rarity_tier: number;
}

export interface EggPoolData {
  '2 km Eggs': EggPokemon[];
  '5 km Eggs': EggPokemon[];
  '7 km Eggs': EggPokemon[];
  '10 km Eggs': EggPokemon[];
  '12 km Eggs': EggPokemon[];
}

export type EggTier = keyof EggPoolData;
