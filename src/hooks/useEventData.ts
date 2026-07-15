import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchEvents } from '../services/eventService';
import type { CalendarEvent } from '../types/events';

/**
 * Custom hook to fetch and manage calendar event data with loading and error states.
 *
 * @returns A custom hook to fetch and manage calendar event data with loading and error states.
 */
export function useEventData(timezone: string) {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const refetch = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const eventData = await fetchEvents(timezone);
      if (requestId === requestIdRef.current) setAllEvents(eventData);
    } catch (err) {
      console.error('Error fetching events:', err);
      if (requestId === requestIdRef.current) {
        setError('Failed to load event data. Please try again later.');
      }
      throw err; // Re-throw error for the caller to handle
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    void refetch().catch(() => undefined);
    return () => {
      requestIdRef.current += 1;
    };
  }, [refetch]);

  return { allEvents, loading, error, refetch };
}
