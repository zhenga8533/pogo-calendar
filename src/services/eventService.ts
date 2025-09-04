import type { ApiEvent, CalendarEvent } from "../types/events";

const API_URL = "https://raw.githubusercontent.com/zhenga8533/leak-duck/data/events.json";

export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch event data");
  }
  const data = await response.json();

  const allEvents: CalendarEvent[] = [];
  for (const category in data) {
    data[category].forEach((event: ApiEvent) => {
      allEvents.push({
        title: event.title,
        start: new Date(event.start_timestamp * 1000),
        end: new Date(event.end_timestamp * 1000),
        allDay: false,
        resource: {
          category: event.category,
          article_url: event.article_url,
        },
      });
    });
  }
  return allEvents;
};
