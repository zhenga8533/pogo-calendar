import { useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { CalendarEvent } from "../types/events";

/**
 * Custom hook to fetch and manage calendar event data with loading and error states.
 *
 * @returns A custom hook to fetch and manage calendar event data with loading and error states.
 */
export function useEventData() {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Async function to fetch event data.
    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        // Only update state if the component is still mounted.
        if (isMounted) {
          setAllEvents(eventData);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        if (isMounted) {
          setError("Failed to load event data. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return { allEvents, loading, error };
}
