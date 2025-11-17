import { useMemo } from 'react';
import { CUSTOM_EVENT_CATEGORY } from '../config/constants';
import type { CalendarEvent, NewEventData } from '../types/events';
import type { Filters } from '../types/filters';
import {
  CustomEventsProvider,
  useCustomEventsContext,
} from './CustomEventsContext';
import { EventDataProvider, useEventDataContext } from './EventDataContext';
import { FilterProvider, useFilterContext } from './FilterContext';

interface CalendarContextType {
  loading: boolean;
  error: string | null;
  filters: Filters;
  setFilters: (filters: Filters | ((prev: Filters) => Filters)) => void;
  handleResetFilters: () => void;
  setCurrentView: (view: string) => void;
  filteredEvents: CalendarEvent[];
  allEvents: CalendarEvent[];
  savedEventIds: string[];
  eventNotes: Record<string, string>;
  allCategories: string[];
  allPokemon: string[];
  allBonuses: string[];
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  refetchEvents: () => Promise<void>;
  handleToggleSaveEvent: (eventId: string) => void;
  addEvent: (eventData: NewEventData) => void;
  updateEvent: (eventId: string, eventData: NewEventData) => void;
  deleteEvent: (eventId: string) => void;
  updateNote: (eventId: string, noteText: string) => void;
}

/**
 * Inner component that consumes all three contexts and provides the combined API
 */
function CalendarContextBridge({ children }: { children: React.ReactNode }) {
  const eventData = useEventDataContext();
  const customEvents = useCustomEventsContext();

  // Combine API events with custom events
  const combinedEvents = useMemo(
    () => [...eventData.allEvents, ...customEvents.customEvents],
    [eventData.allEvents, customEvents.customEvents]
  );

  return (
    <FilterProvider
      allEvents={combinedEvents}
      savedEventIds={customEvents.savedEventIds}
    >
      {children}
    </FilterProvider>
  );
}

/**
 * Provider that composes all three contexts
 */
export function CalendarProvider({ children }: { children: React.ReactNode }) {
  return (
    <EventDataProvider>
      <CustomEventsProvider>
        <CalendarContextBridge>{children}</CalendarContextBridge>
      </CustomEventsProvider>
    </EventDataProvider>
  );
}

/**
 * Hook that combines all three contexts into a single API
 * This maintains backward compatibility with the old CalendarContext
 */
export function useCalendarContext(): CalendarContextType {
  const eventData = useEventDataContext();
  const customEvents = useCustomEventsContext();
  const filters = useFilterContext();

  // Combine API events with custom events
  const combinedEvents = useMemo(
    () => [...eventData.allEvents, ...customEvents.customEvents],
    [eventData.allEvents, customEvents.customEvents]
  );

  // Enhanced addEvent that also updates filters
  const handleAddEvent = (eventData: NewEventData) => {
    customEvents.addEvent(eventData);
    if (filters.filters.selectedCategories.length > 0) {
      filters.setFilters((prev) => ({
        ...prev,
        selectedCategories: [
          ...new Set([...prev.selectedCategories, CUSTOM_EVENT_CATEGORY]),
        ],
      }));
    }
  };

  return useMemo(
    () => ({
      // Event data context
      loading: eventData.loading,
      error: eventData.error,
      allEvents: combinedEvents,
      eventNotes: eventData.eventNotes,
      selectedEvent: eventData.selectedEvent,
      setSelectedEvent: eventData.setSelectedEvent,
      refetchEvents: eventData.refetchEvents,
      updateNote: eventData.updateNote,
      allCategories: eventData.allCategories,
      allPokemon: eventData.allPokemon,
      allBonuses: eventData.allBonuses,

      // Custom events context
      savedEventIds: customEvents.savedEventIds,
      addEvent: handleAddEvent,
      updateEvent: customEvents.updateEvent,
      deleteEvent: customEvents.deleteEvent,
      handleToggleSaveEvent: customEvents.handleToggleSaveEvent,

      // Filter context
      filters: filters.filters,
      setFilters: filters.setFilters,
      handleResetFilters: filters.handleResetFilters,
      setCurrentView: filters.setCurrentView,
      filteredEvents: filters.filteredEvents,
    }),
    [
      eventData,
      customEvents,
      filters,
      combinedEvents,
      handleAddEvent,
    ]
  );
}
