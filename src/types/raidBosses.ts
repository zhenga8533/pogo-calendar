export interface RaidBoss {
  name: string;
  tier: number;
  shiny_available: boolean;
  cp_range: {
    min: number;
    max: number;
  };
  boosted_cp_range: {
    min: number;
    max: number;
  };
  types: string[];
  asset_url: string;
}

export interface RaidBossData {
  'Tier 1': RaidBoss[];
  'Tier 3': RaidBoss[];
  'Tier 5': RaidBoss[];
  'Mega Raids': RaidBoss[];
}

export type RaidTier = keyof RaidBossData;
