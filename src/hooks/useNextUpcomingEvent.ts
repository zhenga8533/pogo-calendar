import { useMemo } from 'react';
import type { CalendarEvent } from '../types/events';

/**
 * A custom hook that takes an array of events and finds the next upcoming event.
 *
 * @param events An array of CalendarEvent objects.
 * @returns The next upcoming event, or null if no upcoming events are found.
 */
export function useNextUpcomingEvent(
  events: CalendarEvent[]
): CalendarEvent | null {
  const nextEvent = useMemo(() => {
    const now = new Date();
    const upcomingEvents = events
      .filter((event) => new Date(event.start) > now)
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );

    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  }, [events]);

  return nextEvent;
}
