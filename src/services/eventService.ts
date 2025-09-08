import type { ApiEvent, CalendarEvent } from "../types/events";

const API_URL = "https://raw.githubusercontent.com/zhenga8533/leak-duck/data/events.json";

/**
 * Fetches event data from the API, transforms it into CalendarEvent format, and returns it.
 *
 * @returns A promise that resolves to an array of CalendarEvent objects fetched and transformed from the API.
 */
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch event data");
  }
  const data = await response.json();

  // Transform the fetched data into CalendarEvent format
  const allEvents: CalendarEvent[] = [];
  for (const category in data) {
    data[category].forEach((event: ApiEvent) => {
      let startDate: Date;
      let endDate: Date;

      if (event.is_local_time) {
        startDate = new Date(event.start_time as string);
        endDate = new Date(event.end_time as string);
      } else {
        startDate = new Date((event.start_time as number) * 1000);
        endDate = new Date((event.end_time as number) * 1000);
      }

      allEvents.push({
        title: event.title,
        start: startDate,
        end: endDate,
        extendedProps: {
          category: event.category,
          article_url: event.article_url,
          banner_url: event.banner_url,
        },
      });
    });
  }
  return allEvents;
};
