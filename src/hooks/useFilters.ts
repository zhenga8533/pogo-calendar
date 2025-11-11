import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { ALL_FILTERS_KEY, SAVED_EVENTS_CATEGORY } from '../config/constants';
import { initialFilters } from '../config/eventFilter';
import type { CalendarEvent } from '../types/events';
import type { Filters } from '../types/filters';

type SetFilters = Dispatch<SetStateAction<Filters>>;

const defaultAllFilters: Record<string, Filters> = {
  dayGridMonth: initialFilters,
  timeGridWeek: initialFilters,
  timeGridDay: initialFilters,
  listWeek: initialFilters,
};

// --- Helper functions for filtering logic ---
const passesSavedFilter = (
  event: CalendarEvent,
  isSavedFilterActive: boolean,
  savedEventIds: string[]
) =>
  !isSavedFilterActive ||
  savedEventIds.includes(event.extendedProps.article_url);

const passesCategoryFilter = (
  event: CalendarEvent,
  otherSelectedCategories: string[]
) =>
  otherSelectedCategories.length === 0 ||
  otherSelectedCategories.includes(event.extendedProps.category);

const passesSearchFilter = (event: CalendarEvent, searchTerm: string) =>
  event.title.toLowerCase().includes(searchTerm.toLowerCase());

const passesDateFilter = (
  event: CalendarEvent,
  startDate: Date | null,
  endDate: Date | null
) => {
  const eventStart = new Date(event.start!);
  const eventEnd = new Date(event.end!);
  return !(
    (startDate && eventEnd < startDate) ||
    (endDate && eventStart > endDate)
  );
};

const passesTimeFilter = (event: CalendarEvent, timeRange: number[]) => {
  const eventStart = new Date(event.start!);
  const eventEnd = new Date(event.end!);
  const [startHour, endHour] = timeRange;
  const eventDurationHours =
    (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
  const isAllDayEvent = eventDurationHours >= 24;
  const eventStartHour = eventStart.getHours();
  return (
    isAllDayEvent || (eventStartHour >= startHour && eventStartHour < endHour)
  );
};

const passesActiveOnlyFilter = (
  event: CalendarEvent,
  showActiveOnly: boolean
) => {
  if (!showActiveOnly) return true;
  const now = new Date();
  const eventStart = new Date(event.start!);
  const eventEnd = new Date(event.end!);
  return now >= eventStart && now <= eventEnd;
};

const passesPokemonFilter = (event: CalendarEvent, pokemonSearch: string[]) => {
  if (pokemonSearch.length === 0) return true;

  // Collect all Pokemon from all fields (everything except bonuses and non-array fields)
  const allPokemonInEvent: string[] = [];
  const nonPokemonFields = [
    'category',
    'article_url',
    'banner_url',
    'description',
    'bonuses',
  ];

  Object.entries(event.extendedProps).forEach(([key, value]) => {
    if (!nonPokemonFields.includes(key) && Array.isArray(value)) {
      allPokemonInEvent.push(...value);
    }
  });

  return pokemonSearch.every((pokemon: string) =>
    allPokemonInEvent.includes(pokemon)
  );
};

const passesBonusFilter = (event: CalendarEvent, bonusSearch: string[]) =>
  bonusSearch.length === 0 ||
  bonusSearch.every((bonus: string) =>
    (event.extendedProps.bonuses ?? []).includes(bonus)
  );
// ---------------------------------------------

export function useFilters(
  allEvents: CalendarEvent[],
  savedEventIds: string[]
) {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  const [allFilters, setAllFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(ALL_FILTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(defaultAllFilters).forEach((view) => {
          parsed[view] = { ...initialFilters, ...parsed[view] };
          if (parsed[view].startDate)
            parsed[view].startDate = new Date(parsed[view].startDate);
          if (parsed[view].endDate)
            parsed[view].endDate = new Date(parsed[view].endDate);
        });
        return parsed;
      }
    } catch (error) {
      console.error('Failed to parse filters from localStorage:', error);
    }

    return defaultAllFilters;
  });

  useEffect(() => {
    localStorage.setItem(ALL_FILTERS_KEY, JSON.stringify(allFilters));
  }, [allFilters]);

  const filtersForCurrentView = allFilters[currentView] || initialFilters;

  const setFiltersForCurrentView: SetFilters = useCallback(
    (update) => {
      setAllFilters((prev: Record<string, Filters>) => {
        const currentFilters: Filters = prev[currentView] || initialFilters;
        const newFilters: Filters =
          typeof update === 'function'
            ? (update as (filters: Filters) => Filters)(currentFilters)
            : (update as Filters);
        return { ...prev, [currentView]: newFilters };
      });
    },
    [currentView]
  );

  const handleResetFilters = useCallback(() => {
    setAllFilters((prev: Record<string, Filters>) => ({
      ...prev,
      [currentView]: initialFilters,
    }));
  }, [currentView]);

  const filteredEvents = useMemo(() => {
    const {
      selectedCategories,
      searchTerm,
      startDate,
      endDate,
      timeRange,
      showActiveOnly,
      pokemonSearch,
      bonusSearch,
    } = filtersForCurrentView;

    const isSavedFilterActive = selectedCategories.includes(
      SAVED_EVENTS_CATEGORY
    );
    const otherSelectedCategories = selectedCategories.filter(
      (c: string) => c !== SAVED_EVENTS_CATEGORY
    );

    return allEvents.filter(
      (event) =>
        passesSavedFilter(event, isSavedFilterActive, savedEventIds) &&
        passesCategoryFilter(event, otherSelectedCategories) &&
        passesSearchFilter(event, searchTerm) &&
        passesDateFilter(event, startDate, endDate) &&
        passesTimeFilter(event, timeRange) &&
        passesActiveOnlyFilter(event, showActiveOnly) &&
        passesPokemonFilter(event, pokemonSearch) &&
        passesBonusFilter(event, bonusSearch)
    );
  }, [allEvents, allFilters, currentView, savedEventIds]);

  return {
    filters: filtersForCurrentView,
    setFilters: setFiltersForCurrentView,
    handleResetFilters,
    setCurrentView,
    filteredEvents,
  };
}
