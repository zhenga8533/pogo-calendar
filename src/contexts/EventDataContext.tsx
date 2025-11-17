import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useEventData } from '../hooks/useEventData';
import { useEventNotes } from '../hooks/useEventNotes';
import type { CalendarEvent } from '../types/events';
import { useSettingsContext } from './SettingsContext';

interface EventDataContextType {
  loading: boolean;
  error: string | null;
  allEvents: CalendarEvent[];
  eventNotes: Record<string, string>;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  refetchEvents: () => Promise<void>;
  updateNote: (eventId: string, noteText: string) => void;
  allCategories: string[];
  allPokemon: string[];
  allBonuses: string[];
}

const EventDataContext = createContext<EventDataContextType | undefined>(
  undefined
);

export function EventDataProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettingsContext();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const {
    allEvents: apiEvents,
    loading,
    error,
    refetch: refetchEvents,
  } = useEventData(settings.timezone);
  const { eventNotes, updateNote } = useEventNotes();

  const { allCategories, allPokemon, allBonuses } = useMemo(() => {
    const categories = new Set<string>();
    const pokemon = new Set<string>();
    const bonuses = new Set<string>();

    apiEvents.forEach((event) => {
      categories.add(event.extendedProps.category);

      // Collect all bonuses
      if (event.extendedProps.bonuses) {
        event.extendedProps.bonuses.forEach((b) => bonuses.add(b));
      }

      // Collect all other fields as Pokemon (everything except the known non-Pokemon fields)
      const nonPokemonFields = [
        'category',
        'article_url',
        'banner_url',
        'description',
        'bonuses',
      ];
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
  }, [apiEvents]);

  const value = useMemo(
    () => ({
      loading,
      error,
      allEvents: apiEvents,
      eventNotes,
      selectedEvent,
      setSelectedEvent,
      refetchEvents,
      updateNote,
      allCategories,
      allPokemon,
      allBonuses,
    }),
    [
      loading,
      error,
      apiEvents,
      eventNotes,
      selectedEvent,
      refetchEvents,
      updateNote,
      allCategories,
      allPokemon,
      allBonuses,
    ]
  );

  return (
    <EventDataContext.Provider value={value}>
      {children}
    </EventDataContext.Provider>
  );
}

export function useEventDataContext() {
  const context = useContext(EventDataContext);
  if (!context) {
    throw new Error(
      'useEventDataContext must be used within an EventDataProvider'
    );
  }
  return context;
}
