import { createContext, useContext, useMemo } from 'react';
import { useCustomEvents } from '../hooks/useCustomEvents';
import { useSavedEvents } from '../hooks/useSavedEvents';
import type { CalendarEvent, NewEventData } from '../types/events';

interface CustomEventsContextType {
  customEvents: CalendarEvent[];
  savedEventIds: string[];
  addEvent: (eventData: NewEventData) => void;
  updateEvent: (eventId: string, eventData: NewEventData) => void;
  deleteEvent: (eventId: string) => void;
  handleToggleSaveEvent: (eventId: string) => void;
}

const CustomEventsContext = createContext<CustomEventsContextType | undefined>(
  undefined
);

export function CustomEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { customEvents, addEvent, updateEvent, deleteEvent } =
    useCustomEvents();
  const { savedEventIds, handleToggleSaveEvent } = useSavedEvents();

  const value = useMemo(
    () => ({
      customEvents,
      savedEventIds,
      addEvent,
      updateEvent,
      deleteEvent,
      handleToggleSaveEvent,
    }),
    [
      customEvents,
      savedEventIds,
      addEvent,
      updateEvent,
      deleteEvent,
      handleToggleSaveEvent,
    ]
  );

  return (
    <CustomEventsContext.Provider value={value}>
      {children}
    </CustomEventsContext.Provider>
  );
}

export function useCustomEventsContext() {
  const context = useContext(CustomEventsContext);
  if (!context) {
    throw new Error(
      'useCustomEventsContext must be used within a CustomEventsProvider'
    );
  }
  return context;
}
