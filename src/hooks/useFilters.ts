import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { initialFilters, SAVED_EVENTS_CATEGORY } from "../config/eventFilter";
import { ALL_FILTERS_KEY } from "../config/storage";
import type { CalendarEvent } from "../types/events";
import type { Filters } from "../types/filters";

type SetFilters = Dispatch<SetStateAction<Filters>>;

const defaultAllFilters: Record<string, Filters> = {
  dayGridMonth: initialFilters,
  timeGridWeek: initialFilters,
  timeGridDay: initialFilters,
  listWeek: initialFilters,
};

/**
 * Custom hook to manage event filters with localStorage persistence and multi-view support.
 *
 * @param allEvents All calendar events to be filtered.
 * @param savedEventIds IDs of saved events for filtering purposes.
 * @returns A custom hook to manage event filters with localStorage persistence and multi-view support.
 */
export function useFilters(allEvents: CalendarEvent[], savedEventIds: string[]) {
  const [currentView, setCurrentView] = useState("dayGridMonth");

  const [allFilters, setAllFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(ALL_FILTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Hydrate the saved data: ensure all views have a filter object and parse date strings back to Date objects.
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

  // Persist allFilters to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem(ALL_FILTERS_KEY, JSON.stringify(allFilters));
  }, [allFilters]);

  const filtersForCurrentView = allFilters[currentView] || initialFilters;

  // Memoize the setter function to provide a stable reference to consumers.
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

  // Memoize the reset function for a stable reference.
  const handleResetFilters = useCallback(() => {
    setAllFilters((prev: Record<string, Filters>) => ({ ...prev, [currentView]: initialFilters }));
  }, [currentView]);

  // Memoize the filtered events to avoid unnecessary recalculations.
  const filteredEvents = useMemo(() => {
    const { selectedCategories, searchTerm, startDate, endDate, timeRange, showActiveOnly } = filtersForCurrentView;
    const isSavedFilterActive = selectedCategories.includes(SAVED_EVENTS_CATEGORY);
    const otherSelectedCategories = selectedCategories.filter((c: string) => c !== SAVED_EVENTS_CATEGORY);
    const now = new Date();

    // Filter events based on the active filters.
    return allEvents.filter((event) => {
      // Saved events filtering: if the "Saved" category is selected, include only saved events.
      const passesSavedFilter = !isSavedFilterActive || savedEventIds.includes(event.extendedProps.article_url);

      // Category filtering: if no categories are selected, all categories pass.
      const passesCategoryFilter =
        otherSelectedCategories.length === 0 || otherSelectedCategories.includes(event.extendedProps.category);

      // Search term filtering: case-insensitive substring match on event title.
      const passesSearchFilter = event.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Date range filtering: checks if the event's duration overlaps with the selected filter range.
      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      const passesDateFilter = !((startDate && eventEnd < startDate) || (endDate && eventStart > endDate));

      // Time range filtering: applies only to events that are not all-day events.
      const [startHour, endHour] = timeRange;
      const eventDurationHours = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
      const isAllDayEvent = eventDurationHours >= 24;
      const eventStartHour = eventStart.getHours();

      const passesTimeFilter = isAllDayEvent || (eventStartHour >= startHour && eventStartHour < endHour);

      // "Currently Active" filter: checks if the current time is between the event's start and end.
      const passesActiveOnlyFilter = !showActiveOnly || (now >= eventStart && now <= eventEnd);

      // The event is included only if it passes all active filter conditions.
      return (
        passesSavedFilter &&
        passesCategoryFilter &&
        passesSearchFilter &&
        passesDateFilter &&
        passesTimeFilter &&
        passesActiveOnlyFilter
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
