import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../types/events";

export const initialFilters = {
  searchTerm: "",
  selectedCategories: [] as string[],
  startDate: null as Date | null,
  endDate: null as Date | null,
  timeRange: [0, 24],
};

const defaultAllFilters = {
  dayGridMonth: initialFilters,
  timeGridWeek: initialFilters,
  timeGridDay: initialFilters,
  listWeek: initialFilters,
};

/**
 * Custom hook to manage event filters.
 *
 * @param allEvents List of all calendar events to be filtered.
 * @param savedEventIds List of saved event IDs for filtering "Saved" events.
 * @returns An object containing filters, setFilters, handleResetFilters, setCurrentView, and filteredEvents.
 */
export function useFilters(allEvents: CalendarEvent[], savedEventIds: string[]) {
  const [currentView, setCurrentView] = useState("dayGridMonth");

  // Initialize allFilters from localStorage or use defaultAllFilters
  const [allFilters, setAllFilters] = useState(() => {
    const saved = localStorage.getItem("allEventFilters");
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.keys(parsed).forEach((view) => {
        if (parsed[view].startDate) parsed[view].startDate = new Date(parsed[view].startDate);
        if (parsed[view].endDate) parsed[view].endDate = new Date(parsed[view].endDate);
      });
      return { ...defaultAllFilters, ...parsed };
    }
    return defaultAllFilters;
  });

  // Persist allFilters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("allEventFilters", JSON.stringify(allFilters));
  }, [allFilters]);

  const filtersForCurrentView = allFilters[currentView as keyof typeof allFilters] || initialFilters;

  // Set filters for the current view
  const setFiltersForCurrentView = (newFilters: typeof initialFilters) => {
    setAllFilters((prev: typeof defaultAllFilters) => ({
      ...prev,
      [currentView]: newFilters,
    }));
  };

  // Reset filters for the current view to initial state
  const handleResetFilters = () => {
    setAllFilters((prev: typeof defaultAllFilters) => ({ ...prev, [currentView]: initialFilters }));
  };

  // Memoized computation of filtered events based on current filters
  const filteredEvents = useMemo(() => {
    const { selectedCategories, searchTerm, startDate, endDate, timeRange } = filtersForCurrentView;
    const isSavedFilterActive = selectedCategories.includes("Saved");
    const otherSelectedCategories = selectedCategories.filter((c: string) => c !== "Saved");

    return allEvents.filter((event) => {
      const isEventSaved = savedEventIds.includes(event.extendedProps.article_url);

      // Saved events filtering
      if (isSavedFilterActive && !isEventSaved) return false;

      // Category filtering
      if (otherSelectedCategories.length > 0 && !otherSelectedCategories.includes(event.extendedProps.category))
        return false;

      // Search term filtering
      if (!event.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // Date range filtering
      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      if (startDate && endDate && (eventStart >= endDate || eventEnd <= startDate)) return false;
      if (startDate && !endDate && eventEnd < startDate) return false;
      if (!startDate && endDate && eventStart > endDate) return false;

      // Time range filtering
      if (timeRange[0] > 0 || timeRange[1] < 24) {
        const [startHour, endHour] = timeRange;
        const eventStartHour = eventStart.getHours();
        const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
        if (eventDuration < 24 && (eventStartHour < startHour || eventStartHour >= endHour)) return false;
      }

      return true;
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
