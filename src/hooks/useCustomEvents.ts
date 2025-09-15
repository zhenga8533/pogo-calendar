import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import defaultBanner from "../assets/images/default-banner.jpg";
import { CUSTOM_EVENTS_KEY } from "../config/storage";
import type { CalendarEvent, NewEventData } from "../types/events";

const CUSTOM_EVENT_CATEGORY = "Custom Event";

/**
 * Custom hook to manage user-created calendar events with localStorage persistence.
 *
 * @returns A custom hook for managing user-created calendar events with localStorage persistence.
 */
export function useCustomEvents() {
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_EVENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure start/end are Date objects after parsing from JSON.
        return parsed.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
      }
    } catch (error) {
      console.error("Failed to parse custom events from localStorage:", error);
    }

    return [];
  });

  // Persist customEvents to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(customEvents));
  }, [customEvents]);

  // Function to add a new custom event.
  const addEvent = useCallback((eventData: NewEventData) => {
    const newEvent: CalendarEvent = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      extendedProps: {
        category: CUSTOM_EVENT_CATEGORY,
        article_url: uuidv4(),
        banner_url: defaultBanner,
        is_local_time: false, // Custom events are always UTC-based
      },
    };
    setCustomEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  // Function to update an existing custom event by its ID.
  const updateEvent = useCallback((eventId: string, eventData: NewEventData) => {
    setCustomEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.extendedProps.article_url === eventId
          ? { ...event, title: eventData.title, start: eventData.start, end: eventData.end }
          : event
      )
    );
  }, []);

  // Function to delete a custom event by its ID.
  const deleteEvent = useCallback((eventId: string) => {
    setCustomEvents((prevEvents) => prevEvents.filter((event) => event.extendedProps.article_url !== eventId));
  }, []);

  return {
    customEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
