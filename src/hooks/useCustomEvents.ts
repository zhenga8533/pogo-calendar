import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import defaultBanner from "../assets/images/default-banner.jpg";
import { CUSTOM_EVENT_CATEGORY } from "../config/eventFilter";
import { CUSTOM_EVENTS_KEY } from "../config/storage";
import type { CalendarEvent, NewEventData } from "../types/events";
import { formatToLocalTime } from "../utils/dateUtils";

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
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Failed to parse custom events from localStorage:", error);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(customEvents));
  }, [customEvents]);

  const addEvent = useCallback((eventData: NewEventData) => {
    const newEvent: CalendarEvent = {
      title: eventData.title,
      start: formatToLocalTime(eventData.start),
      end: formatToLocalTime(eventData.end),
      extendedProps: {
        category: CUSTOM_EVENT_CATEGORY,
        article_url: uuidv4(),
        banner_url: defaultBanner,
      },
    };
    setCustomEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  const updateEvent = useCallback((eventId: string, eventData: NewEventData) => {
    setCustomEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.extendedProps.article_url === eventId
          ? {
              ...event,
              title: eventData.title,
              start: formatToLocalTime(eventData.start),
              end: formatToLocalTime(eventData.end),
            }
          : event
      )
    );
  }, []);

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
