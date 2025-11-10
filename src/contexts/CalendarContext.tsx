import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CUSTOM_EVENT_CATEGORY } from "../config/constants";
import { useCustomEvents } from "../hooks/useCustomEvents";
import { useEventData } from "../hooks/useEventData";
import { useEventNotes } from "../hooks/useEventNotes";
import { useFilters } from "../hooks/useFilters";
import { useSavedEvents } from "../hooks/useSavedEvents";
import type { CalendarEvent, NewEventData } from "../types/events";
import { useSettingsContext } from "./SettingsContext";

interface CalendarContextType {
  loading: boolean;
  error: string | null;
  filters: any;
  setFilters: (filters: any) => void;
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

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const { allEvents: apiEvents, loading, error, refetch: refetchEvents } = useEventData(settings.timezone);
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();
  const { customEvents, addEvent, updateEvent, deleteEvent } = useCustomEvents();
  const { eventNotes, updateNote } = useEventNotes();

  const combinedEvents = useMemo(() => [...apiEvents, ...customEvents], [apiEvents, customEvents]);

  const { filters, setFilters, handleResetFilters, setCurrentView, filteredEvents } = useFilters(
    combinedEvents,
    savedEventIds
  );

  const { allCategories, allPokemon, allBonuses } = useMemo(() => {
    const categories = new Set<string>();
    const pokemon = new Set<string>();
    const bonuses = new Set<string>();

    combinedEvents.forEach((event) => {
      categories.add(event.extendedProps.category);

      // Collect all bonuses
      if (event.extendedProps.bonuses) {
        event.extendedProps.bonuses.forEach((b) => bonuses.add(b));
      }

      // Collect all other fields as Pokemon (everything except the known non-Pokemon fields)
      const nonPokemonFields = ['category', 'article_url', 'banner_url', 'description', 'bonuses'];
      Object.entries(event.extendedProps).forEach(([key, value]) => {
        if (!nonPokemonFields.includes(key) && Array.isArray(value)) {
          value.forEach((item) => pokemon.add(item));
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
      addEvent(eventData);
      if (filters.selectedCategories.length > 0) {
        setFilters((prev: any) => ({
          ...prev,
          selectedCategories: [...new Set([...prev.selectedCategories, CUSTOM_EVENT_CATEGORY])],
        }));
      }
    },
    [addEvent, filters.selectedCategories, setFilters]
  );

  const value = useMemo(
    () => ({
      loading,
      error,
      filters,
      setFilters,
      handleResetFilters,
      setCurrentView,
      filteredEvents,
      allEvents: combinedEvents,
      savedEventIds,
      eventNotes,
      allCategories,
      allPokemon,
      allBonuses,
      selectedEvent,
      setSelectedEvent,
      refetchEvents,
      handleToggleSaveEvent,
      addEvent: handleAddEvent,
      updateEvent,
      deleteEvent,
      updateNote,
    }),
    [
      loading,
      error,
      filters,
      setFilters,
      handleResetFilters,
      setCurrentView,
      filteredEvents,
      combinedEvents,
      savedEventIds,
      eventNotes,
      allCategories,
      allPokemon,
      allBonuses,
      selectedEvent,
      refetchEvents,
      handleToggleSaveEvent,
      handleAddEvent,
      updateEvent,
      deleteEvent,
      updateNote,
    ]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}
