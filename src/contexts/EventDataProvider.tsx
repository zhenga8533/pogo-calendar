import { useMemo, useState } from 'react';
import { useEventData } from '../hooks/useEventData';
import { useEventNotes } from '../hooks/useEventNotes';
import { useSettingsContext } from '../hooks/useSettingsContext';
import type { CalendarEvent } from '../types/events';
import { EventDataContext } from './EventDataContext';

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
    }),
    [
      loading,
      error,
      apiEvents,
      eventNotes,
      selectedEvent,
      refetchEvents,
      updateNote,
    ]
  );

  return (
    <EventDataContext.Provider value={value}>
      {children}
    </EventDataContext.Provider>
  );
}
