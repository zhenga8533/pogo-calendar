import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { CalendarEvent } from "../types/events";

export type NewEventData = {
  title: string;
  start: Date;
  end: Date;
};

/**
 * Custom hook to manage user-created events with local storage persistence.
 *
 * @returns An object containing custom events and functions to add or delete them.
 */
export function useCustomEvents() {
  // Initialize custom events from local storage
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("customEvents");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    }
    return [];
  });

  // Persist custom events to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("customEvents", JSON.stringify(customEvents));
  }, [customEvents]);

  // Function to add a new custom event
  const addCustomEvent = (eventData: NewEventData) => {
    const newEvent: CalendarEvent = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      extendedProps: {
        category: "Custom Event",
        article_url: uuidv4(),
        banner_url: "https://cdn.leekduck.com/assets/img/events/events-default-img.jpg",
      },
    };
    setCustomEvents((prev) => [...prev, newEvent]);
  };

  // Function to delete a custom event by its unique article_url
  const deleteCustomEvent = (eventId: string) => {
    setCustomEvents((prev) => prev.filter((event) => event.extendedProps.article_url !== eventId));
  };

  return { customEvents, addCustomEvent, deleteCustomEvent };
}
