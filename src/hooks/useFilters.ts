import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "../types/events";

export const initialFilters = {
  searchTerm: "",
  selectedCategories: [] as string[],
  startDate: null as Date | null,
  endDate: null as Date | null,
  timeRange: [0, 24],
};

export function useFilters(allEvents: CalendarEvent[], savedEventIds: string[]) {
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("eventFilters");
    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters);
      if (parsedFilters.startDate) {
        parsedFilters.startDate = new Date(parsedFilters.startDate);
      }
      if (parsedFilters.endDate) {
        parsedFilters.endDate = new Date(parsedFilters.endDate);
      }
      return { ...initialFilters, ...parsedFilters };
    }
    return initialFilters;
  });

  useEffect(() => {
    localStorage.setItem("eventFilters", JSON.stringify(filters));
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredEvents = useMemo(() => {
    const { selectedCategories } = filters;
    const isSavedFilterActive = selectedCategories.includes("Saved");
    const otherSelectedCategories = selectedCategories.filter((c: string) => c !== "Saved");

    return allEvents.filter((event) => {
      const isEventSaved = savedEventIds.includes(event.extendedProps.article_url);

      // Saved events filtering
      if (isSavedFilterActive && !isEventSaved) {
        return false;
      }

      // Category filtering
      if (otherSelectedCategories.length > 0 && !otherSelectedCategories.includes(event.extendedProps.category)) {
        return false;
      }

      // Search term filtering
      const searchMatch = event.title.toLowerCase().includes(filters.searchTerm.toLowerCase());
      if (!searchMatch) return false;

      const eventStart = new Date(event.start!);
      const eventEnd = new Date(event.end!);
      const filterStart = filters.startDate;
      const filterEnd = filters.endDate;

      // Date range filtering
      if (filterStart && filterEnd && (eventStart >= filterEnd || eventEnd <= filterStart)) {
        return false;
      }
      if (filterStart && !filterEnd && eventEnd < filterStart) {
        return false;
      }
      if (!filterStart && filterEnd && eventStart > filterEnd) {
        return false;
      }

      // Time range filtering
      if (filters.timeRange[0] > 0 || filters.timeRange[1] < 24) {
        const [startHour, endHour] = filters.timeRange;
        const eventStartHour = eventStart.getHours();
        const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);

        if (eventDuration < 24 && (eventStartHour < startHour || eventStartHour >= endHour)) {
          return false;
        }
      }

      return true;
    });
  }, [allEvents, filters, savedEventIds]);

  return { filters, setFilters, handleResetFilters, filteredEvents };
}
