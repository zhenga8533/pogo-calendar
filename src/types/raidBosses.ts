export interface CPRange {
  min: number;
  max: number;
}

export interface RaidBoss {
  name: string;
  tier: number;
  shiny_available: boolean;
  cp_range: CPRange;
  boosted_cp_range: CPRange;
  types: string[];
  asset_url: string;
}

// Using index signature to support any raid tier (Tier 1, Tier 3, Tier 5, Mega Raids, Shadow Raids, etc.)
export interface RaidBossData {
  [tier: string]: RaidBoss[];
}
