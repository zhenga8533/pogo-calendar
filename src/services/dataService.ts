import type { EggPoolData } from '../types/eggPool';
import type { RaidBossData } from '../types/raidBosses';
import type { ResearchTaskData } from '../types/researchTasks';
import type { RocketLineupData } from '../types/rocketLineup';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/zhenga8533/leak-duck/data';

export const GITHUB_EGG_POOL_URL = `${GITHUB_BASE_URL}/egg_pool.json`;
export const GITHUB_RAID_BOSSES_URL = `${GITHUB_BASE_URL}/raid_bosses.json`;
export const GITHUB_RESEARCH_TASKS_URL = `${GITHUB_BASE_URL}/research_task.json`;
export const GITHUB_ROCKET_LINEUP_URL = `${GITHUB_BASE_URL}/rocket_lineup.json`;

export const fetchEggPool = async (): Promise<EggPoolData> => {
  const response = await fetch(GITHUB_EGG_POOL_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const fetchRaidBosses = async (): Promise<RaidBossData> => {
  const response = await fetch(GITHUB_RAID_BOSSES_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const fetchResearchTasks = async (): Promise<ResearchTaskData> => {
  const response = await fetch(GITHUB_RESEARCH_TASKS_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};

export const fetchRocketLineup = async (): Promise<RocketLineupData> => {
  const response = await fetch(GITHUB_ROCKET_LINEUP_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
};
