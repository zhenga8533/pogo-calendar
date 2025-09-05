import { useEffect, useState } from "react";
import { fetchEvents } from "../services/eventService";
import type { CalendarEvent } from "../types/events";

export function useEventData() {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
