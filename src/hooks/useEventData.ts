import { useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { CalendarEvent } from "../types/events";

/**
 * Custom hook to fetch and manage event data.
 *
 * @returns An object containing all events and loading state.
 */
export function useEventData() {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch events on component mount
  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventData = await fetchEvents();
        setAllEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  return { allEvents, loading };
}
