import { useMemo } from 'react';
import { useCustomEventsContext } from '../hooks/useCustomEventsContext';
import { useEventDataContext } from '../hooks/useEventDataContext';
import { CustomEventsProvider } from './CustomEventsProvider';
import { EventDataProvider } from './EventDataProvider';
import { FilterProvider } from './FilterProvider';

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
