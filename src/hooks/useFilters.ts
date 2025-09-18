import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { ALL_FILTERS_KEY, SAVED_EVENTS_CATEGORY } from "../config/constants";
import { initialFilters } from "../config/eventFilter";
import type { CalendarEvent } from "../types/events";
import type { Filters } from "../types/filters";

type SetFilters = Dispatch<SetStateAction<Filters>>;

const defaultAllFilters: Record<string, Filters> = {
  dayGridMonth: initialFilters,
  timeGridWeek: initialFilters,
  timeGridDay: initialFilters,
  listWeek: initialFilters,
};

export function useFilters(allEvents: CalendarEvent[], savedEventIds: string[]) {
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [allFilters, setAllFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(ALL_FILTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.keys(defaultAllFilters).forEach((view) => {
          parsed[view] = { ...initialFilters, ...parsed[view] };
          if (parsed[view].startDate) parsed[view].startDate = new Date(parsed[view].startDate);
          if (parsed[view].endDate) parsed[view].endDate = new Date(parsed[view].endDate);
        });
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse filters from localStorage:", error);
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
          typeof update === "function"
            ? (update as (filters: Filters) => Filters)(currentFilters)
            : (update as Filters);
        return { ...prev, [currentView]: newFilters };
      });
    },
    [currentView]
  );

  const handleResetFilters = useCallback(() => {
    setAllFilters((prev: Record<string, Filters>) => ({ ...prev, [currentView]: initialFilters }));
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
    const isSavedFilterActive = selectedCategories.includes(SAVED_EVENTS_CATEGORY);
    const otherSelectedCategories = selectedCategories.filter((c: string) => c !== SAVED_EVENTS_CATEGORY);
    const now = new Date();

    return allEvents.filter((event) => {
      const passesSavedFilter = !isSavedFilterActive || savedEventIds.includes(event.extendedProps.article_url);

      const passesCategoryFilter =
        otherSelectedCategories.length === 0 || otherSelectedCategories.includes(event.extendedProps.category);

      const passesSearchFilter = event.title.toLowerCase().includes(searchTerm.toLowerCase());

      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      const passesDateFilter = !((startDate && eventEnd < startDate) || (endDate && eventStart > endDate));

      const [startHour, endHour] = timeRange;
      const eventDurationHours = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
      const isAllDayEvent = eventDurationHours >= 24;
      const eventStartHour = eventStart.getHours();

      const passesTimeFilter = isAllDayEvent || (eventStartHour >= startHour && eventStartHour < endHour);

      const passesActiveOnlyFilter = !showActiveOnly || (now >= eventStart && now <= eventEnd);

      const passesPokemonFilter =
        pokemonSearch.length === 0 ||
        pokemonSearch.every((pokemon: string) =>
          [
            ...(event.extendedProps.features ?? []),
            ...(event.extendedProps.spawns ?? []),
            ...(event.extendedProps.raids ?? []),
            ...(event.extendedProps.shiny ?? []),
            ...(event.extendedProps.shadow ?? []),
          ].includes(pokemon)
        );

      const passesBonusFilter =
        bonusSearch.length === 0 ||
        bonusSearch.every((bonus: string) => (event.extendedProps.bonuses ?? []).includes(bonus));

      return (
        passesSavedFilter &&
        passesCategoryFilter &&
        passesSearchFilter &&
        passesDateFilter &&
        passesTimeFilter &&
        passesActiveOnlyFilter &&
        passesPokemonFilter &&
        passesBonusFilter
      );
    });
  }, [allEvents, allFilters, currentView, savedEventIds]);

  return {
    filters: filtersForCurrentView,
    setFilters: setFiltersForCurrentView,
    handleResetFilters,
    setCurrentView,
    filteredEvents,
  };
}
