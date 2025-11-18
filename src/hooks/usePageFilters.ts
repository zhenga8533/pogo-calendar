import { useCallback, useMemo, useState } from 'react';
import type {
  EggPoolFilters,
  RaidBossFilters,
  ResearchTaskFilters,
  RocketLineupFilters,
} from '../types/pageFilters';

// Default filter states for each page type
export const defaultEggPoolFilters: EggPoolFilters = {
  pokemonSearch: '',
  selectedEggTiers: [],
  selectedRarityTiers: [],
  shinyOnly: false,
};

export const defaultRaidBossFilters: RaidBossFilters = {
  pokemonSearch: '',
  selectedRaidTiers: [],
  selectedTypes: [],
  shinyOnly: false,
  minCP: 0,
  maxCP: 60000,
};

export const defaultResearchTaskFilters: ResearchTaskFilters = {
  taskSearch: '',
  pokemonSearch: '',
  rewardTypes: [],
  shinyOnly: false,
  selectedCategories: [],
};

export const defaultRocketLineupFilters: RocketLineupFilters = {
  pokemonSearch: '',
  selectedLeaders: [],
  selectedSlots: [],
  encounterOnly: false,
  shinyOnly: false,
};

// Hook for Egg Pool filters
export function useEggPoolFilters() {
  const [filters, setFilters] = useState<EggPoolFilters>(
    defaultEggPoolFilters
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultEggPoolFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.pokemonSearch ? 1 : 0) +
      filters.selectedEggTiers.length +
      filters.selectedRarityTiers.length +
      (filters.shinyOnly ? 1 : 0)
    );
  }, [filters]);

  return { filters, setFilters, resetFilters, activeFilterCount };
}

// Hook for Raid Boss filters
export function useRaidBossFilters() {
  const [filters, setFilters] = useState<RaidBossFilters>(
    defaultRaidBossFilters
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultRaidBossFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.pokemonSearch ? 1 : 0) +
      filters.selectedRaidTiers.length +
      filters.selectedTypes.length +
      (filters.shinyOnly ? 1 : 0) +
      (filters.minCP > 0 || filters.maxCP < 60000 ? 1 : 0)
    );
  }, [filters]);

  return { filters, setFilters, resetFilters, activeFilterCount };
}

// Hook for Research Task filters
export function useResearchTaskFilters() {
  const [filters, setFilters] = useState<ResearchTaskFilters>(
    defaultResearchTaskFilters
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultResearchTaskFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.taskSearch ? 1 : 0) +
      (filters.pokemonSearch ? 1 : 0) +
      filters.rewardTypes.length +
      (filters.shinyOnly ? 1 : 0) +
      filters.selectedCategories.length
    );
  }, [filters]);

  return { filters, setFilters, resetFilters, activeFilterCount };
}

// Hook for Rocket Lineup filters
export function useRocketLineupFilters() {
  const [filters, setFilters] = useState<RocketLineupFilters>(
    defaultRocketLineupFilters
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultRocketLineupFilters);
  }, []);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.pokemonSearch ? 1 : 0) +
      filters.selectedLeaders.length +
      filters.selectedSlots.length +
      (filters.encounterOnly ? 1 : 0) +
      (filters.shinyOnly ? 1 : 0)
    );
  }, [filters]);

  return { filters, setFilters, resetFilters, activeFilterCount };
}
