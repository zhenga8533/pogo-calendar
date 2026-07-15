import type { CPRange } from './raidBosses';

export interface TaskReward {
  type: string;
  name: string;
  quantity?: number;
  shiny_available?: boolean;
  cp_range?: CPRange | null;
  asset_url: string | null;
}

export interface ResearchTask {
  task: string;
  rewards: TaskReward[];
}

export interface ResearchTaskData {
  [category: string]: ResearchTask[];
}
