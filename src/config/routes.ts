/**
 * Application route configuration
 * Centralizes all route paths to avoid string repetition
 */

export const ROUTES = {
  CALENDAR: '/',
  EGG_POOL: '/egg-pool',
  RAID_BOSSES: '/raid-bosses',
  RESEARCH_TASKS: '/research-tasks',
  ROCKET_LINEUP: '/rocket-lineup',
  FAQ: '/faq',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Route metadata for navigation and display
 */
export interface RouteInfo {
  path: RoutePath;
  label: string;
  description: string;
}

export const ROUTE_INFO: Record<string, RouteInfo> = {
  CALENDAR: {
    path: ROUTES.CALENDAR,
    label: 'Calendar',
    description: 'Event calendar and schedule',
  },
  EGG_POOL: {
    path: ROUTES.EGG_POOL,
    label: 'Egg Pool',
    description: 'Current egg hatches',
  },
  RAID_BOSSES: {
    path: ROUTES.RAID_BOSSES,
    label: 'Raid Bosses',
    description: 'Active raid bosses',
  },
  RESEARCH_TASKS: {
    path: ROUTES.RESEARCH_TASKS,
    label: 'Research Tasks',
    description: 'Field research tasks',
  },
  ROCKET_LINEUP: {
    path: ROUTES.ROCKET_LINEUP,
    label: 'Rocket Lineup',
    description: 'Team GO Rocket lineups',
  },
  FAQ: {
    path: ROUTES.FAQ,
    label: 'FAQ',
    description: 'Frequently asked questions',
  },
} as const;
