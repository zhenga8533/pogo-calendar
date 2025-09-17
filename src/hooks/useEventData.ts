import { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { CalendarEvent } from "../types/events";

/**
 * Custom hook to fetch and manage calendar event data with loading and error states.
 *
 * @returns A custom hook to fetch and manage calendar event data with loading and error states.
 */
export function useEventData(timezone: string) {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const eventData = await fetchEvents(timezone);
      setAllEvents(eventData);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load event data. Please try again later.");
      throw err; // Re-throw error for the caller to handle
    } finally {
      setLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { allEvents, loading, error, refetch };
}
