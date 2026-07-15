import type { CPRange } from './raidBosses';

export interface TaskReward {
  type: 'item' | 'encounter';
  name: string;
  quantity?: number;
  shiny_available?: boolean;
  cp_range?: CPRange | null;
  asset_url: string;
}

export interface ResearchTask {
  task: string;
  rewards: TaskReward[];
}

export interface ResearchTaskData {
  [category: string]: ResearchTask[];
}
