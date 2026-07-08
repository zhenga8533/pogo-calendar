import { createContext } from 'react';
import type { CalendarEvent, NewEventData } from '../types/events';

export interface CustomEventsContextType {
  customEvents: CalendarEvent[];
  savedEventIds: string[];
  addEvent: (eventData: NewEventData) => void;
  updateEvent: (eventId: string, eventData: NewEventData) => void;
  deleteEvent: (eventId: string) => void;
  handleToggleSaveEvent: (eventId: string) => void;
}

export const CustomEventsContext = createContext<CustomEventsContextType | undefined>(
  undefined
);
