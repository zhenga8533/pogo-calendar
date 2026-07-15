import { createContext } from 'react';
import type { CalendarEvent } from '../types/events';

export interface EventDataContextType {
  loading: boolean;
  error: string | null;
  allEvents: CalendarEvent[];
  eventNotes: Record<string, string>;
  selectedEvent: CalendarEvent | null;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  refetchEvents: () => Promise<void>;
  updateNote: (eventId: string, noteText: string) => void;
}

export const EventDataContext = createContext<EventDataContextType | undefined>(
  undefined
);
