import { useMemo } from 'react';
import { useCustomEvents } from '../hooks/useCustomEvents';
import { useSavedEvents } from '../hooks/useSavedEvents';
import { CustomEventsContext } from './customEventsContextValue';

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
