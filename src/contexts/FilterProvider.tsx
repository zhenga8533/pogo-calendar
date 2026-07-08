import { useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import type { CalendarEvent } from '../types/events';
import { FilterContext } from './FilterContext';

export function FilterProvider({
  children,
  allEvents,
  savedEventIds,
}: {
  children: React.ReactNode;
  allEvents: CalendarEvent[];
  savedEventIds: string[];
}) {
  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } =
    useFilters(allEvents, savedEventIds);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      handleResetFilters,
      setCurrentView,
      filteredEvents,
    }),
    [filters, setFilters, handleResetFilters, setCurrentView, filteredEvents]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
}
