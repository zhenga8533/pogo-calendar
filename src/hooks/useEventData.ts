import { useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { ApiResponse } from "../types/events";

/**
 * Custom hook to fetch and manage raw calendar event data with loading and error states.
 *
 * @returns An object containing the raw event data, loading state, and error state.
 */
export function useEventData() {
  const [rawEvents, setRawEvents] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        if (isMounted) {
          setRawEvents(eventData);
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

  return { rawEvents, loading, error };
}
