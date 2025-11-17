export interface EggPokemon {
  name: string;
  shiny_available: boolean;
  asset_url: string;
  hatch_distance: number;
  rarity_tier: number;
}

// Using index signature to support any egg distance (2km, 5km, 7km, 10km, 12km, 15km, etc.)
export interface EggPoolData {
  [tier: string]: EggPokemon[];
}
