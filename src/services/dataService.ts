import type { EggPoolData } from '../types/eggPool';
import type { RaidBossData } from '../types/raidBosses';
import type { ResearchTaskData } from '../types/researchTasks';
import type { RocketLineupData } from '../types/rocketLineup';
import { createDataFetcher } from './utils/createFetcher';

const GITHUB_BASE_URL =
  'https://raw.githubusercontent.com/zhenga8533/leak-duck/data';

export const GITHUB_EGG_POOL_URL = `${GITHUB_BASE_URL}/egg_pool.json`;
export const GITHUB_RAID_BOSSES_URL = `${GITHUB_BASE_URL}/raid_bosses.json`;
export const GITHUB_RESEARCH_TASKS_URL = `${GITHUB_BASE_URL}/research_tasks.json`;
export const GITHUB_ROCKET_LINEUP_URL = `${GITHUB_BASE_URL}/rocket_lineups.json`;

/**
 * Fetch egg pool data from the GitHub repository
 */
export const fetchEggPool = createDataFetcher<EggPoolData>(GITHUB_EGG_POOL_URL);

/**
 * Fetch raid bosses data from the GitHub repository
 */
export const fetchRaidBosses = createDataFetcher<RaidBossData>(
  GITHUB_RAID_BOSSES_URL
);

/**
 * Fetch research tasks data from the GitHub repository
 */
export const fetchResearchTasks = createDataFetcher<ResearchTaskData>(
  GITHUB_RESEARCH_TASKS_URL
);

/**
 * Fetch rocket lineup data from the GitHub repository
 */
export const fetchRocketLineup = createDataFetcher<RocketLineupData>(
  GITHUB_ROCKET_LINEUP_URL
);
