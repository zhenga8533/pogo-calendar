import { createContext } from 'react';
import type { CalendarEvent } from '../types/events';
import type { Filters } from '../types/filters';

export interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  handleResetFilters: () => void;
  setCurrentView: (view: string) => void;
  filteredEvents: CalendarEvent[];
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);
