export interface TaskReward {
  type: 'item' | 'encounter';
  name: string;
  quantity?: number;
  shiny_available?: boolean;
  cp_range?: {
    min: number;
    max: number;
  } | null;
  asset_url: string;
}

export interface ResearchTask {
  task: string;
  rewards: TaskReward[];
}

export interface ResearchTaskData {
  [category: string]: ResearchTask[];
}
