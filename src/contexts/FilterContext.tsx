import { createContext, useContext, useMemo } from 'react';
import { useFilters } from '../hooks/useFilters';
import type { CalendarEvent } from '../types/events';
import type { Filters } from '../types/filters';

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  handleResetFilters: () => void;
  setCurrentView: (view: string) => void;
  filteredEvents: CalendarEvent[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

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

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}
