import { GITHUB_EVENTS_API_URL, TIMEZONES_API_URL } from "../config/api";
import type { ApiEvent, CalendarEvent } from "../types/events";
import type { Timezone } from "../types/settings";

type ApiResponse = Record<string, ApiEvent[]>;

/**
 * Parses a time value from the API into a Date object.
 *
 * @param time The time value from the API, either a string or a number.
 * @param isLocal Indicates if the time is in local format (true) or UTC timestamp (false).
 * @returns A Date object representing the parsed time.
 */
function parseApiDate(time: string | number, isLocal: boolean): Date {
  if (isLocal) {
    // The time is a pre-formatted local time string (e.g., "2025-09-11T14:00:00").
    return new Date(time as string);
  }

  // The time is a UTC timestamp in seconds, so we multiply by 1000 for milliseconds.
  return new Date((time as number) * 1000);
}

/**
 * Transforms the raw API response data into an array of CalendarEvent objects.
 *
 * @param data The raw API response data.
 * @returns An array of CalendarEvent objects.
 */
function transformApiData(data: ApiResponse): CalendarEvent[] {
  return Object.values(data).flatMap((eventsInCategory) =>
    eventsInCategory.map((event: ApiEvent) => ({
      title: event.title,
      start: parseApiDate(event.start_time, event.is_local_time),
      end: parseApiDate(event.end_time, event.is_local_time),
      extendedProps: {
        category: event.category,
        article_url: event.article_url,
        banner_url: event.banner_url,
      },
    }))
  );
}

/**
 * Fetches events from the GitHub Events API and transforms them into CalendarEvent objects.
 *
 * @returns A promise that resolves to an array of CalendarEvent objects fetched from the API.
 */
export const fetchEvents = async (): Promise<CalendarEvent[]> => {
  const response = await fetch(GITHUB_EVENTS_API_URL);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  return transformApiData(data);
};

/**
 * Fetches a list of IANA time zones.
 *
 * @returns A promise that resolves to an array of Timezone objects.
 */
export const fetchTimezones = async (): Promise<Timezone[]> => {
  const response = await fetch(TIMEZONES_API_URL);
  if (!response.ok) {
    throw new Error(`Timezone API request failed with status ${response.status}`);
  }
  return response.json();
};
