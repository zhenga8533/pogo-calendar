import { useCallback, useMemo } from 'react';
import { CUSTOM_EVENT_CATEGORY } from '../config/constants';
import {
  getPokemonName,
  type CalendarEvent,
  type NewEventData,
} from '../types/events';
import type { Filters } from '../types/filters';
import { useCustomEventsContext } from './useCustomEventsContext';
import { useEventDataContext } from './useEventDataContext';
import { useFilterContext } from './useFilterContext';

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

export function useCalendarContext(): CalendarContextType {
  const eventData = useEventDataContext();
  const customEvents = useCustomEventsContext();
  const filters = useFilterContext();

  const combinedEvents = useMemo(
    () => [...eventData.allEvents, ...customEvents.customEvents],
    [eventData.allEvents, customEvents.customEvents]
  );

  const metadata = useMemo(() => {
    const categories = new Set<string>();
    const pokemon = new Set<string>();
    const bonuses = new Set<string>();
    const nonPokemonFields = new Set([
      'category',
      'article_url',
      'banner_url',
      'description',
      'bonuses',
      'is_local_time',
      'start_instant',
      'end_instant',
    ]);

    combinedEvents.forEach((event) => {
      categories.add(event.extendedProps.category);
      event.extendedProps.bonuses?.forEach((bonus) => bonuses.add(bonus));
      Object.entries(event.extendedProps).forEach(([key, value]) => {
        if (!nonPokemonFields.has(key) && Array.isArray(value)) {
          value.forEach((item) => pokemon.add(getPokemonName(item)));
        }
      });
    });

    return {
      allCategories: Array.from(categories).sort(),
      allPokemon: Array.from(pokemon).sort(),
      allBonuses: Array.from(bonuses).sort(),
    };
  }, [combinedEvents]);

  const handleAddEvent = useCallback(
    (eventData: NewEventData) => {
      customEvents.addEvent(eventData);
      if (filters.filters.selectedCategories.length > 0) {
        filters.setFilters((prev) => ({
          ...prev,
          selectedCategories: [
            ...new Set([...prev.selectedCategories, CUSTOM_EVENT_CATEGORY]),
          ],
        }));
      }
    },
    [customEvents, filters]
  );

  return useMemo(
    () => ({
      loading: eventData.loading,
      error: eventData.error,
      allEvents: combinedEvents,
      eventNotes: eventData.eventNotes,
      selectedEvent: eventData.selectedEvent,
      setSelectedEvent: eventData.setSelectedEvent,
      refetchEvents: eventData.refetchEvents,
      updateNote: eventData.updateNote,
      allCategories: metadata.allCategories,
      allPokemon: metadata.allPokemon,
      allBonuses: metadata.allBonuses,
      savedEventIds: customEvents.savedEventIds,
      addEvent: handleAddEvent,
      updateEvent: customEvents.updateEvent,
      deleteEvent: customEvents.deleteEvent,
      handleToggleSaveEvent: customEvents.handleToggleSaveEvent,
      filters: filters.filters,
      setFilters: filters.setFilters,
      handleResetFilters: filters.handleResetFilters,
      setCurrentView: filters.setCurrentView,
      filteredEvents: filters.filteredEvents,
    }),
    [eventData, customEvents, filters, combinedEvents, handleAddEvent, metadata]
  );
}
