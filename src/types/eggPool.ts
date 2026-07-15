export interface EggPokemon {
  name: string;
  shiny_available: boolean;
  asset_url: string | null;
  hatch_distance: number | null;
  rarity_tier: number | null;
}

// Using index signature to support any egg distance (2km, 5km, 7km, 10km, 12km, 15km, etc.)
export interface EggPoolData {
  [tier: string]: EggPokemon[];
}
