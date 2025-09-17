import { GITHUB_EVENTS_API_URL, TIMEZONES_API_URL } from "../config/api";
import type { ApiEvent, CalendarEvent } from "../types/events";
import type { Timezone } from "../types/settings";

type ApiResponse = Record<string, ApiEvent[]>;

function parseApiTime(time: string | number, isLocal: boolean, timezone: string): string {
  let date: Date;

  if (isLocal) {
    date = new Date(time);
  } else {
    date = new Date((time as number) * 1000);
  }

  // Handle timezone override for UTC offset strings
  const timezoneMatch = timezone.match(/\(UTC([+-]\d{2}):(\d{2})\)/);
  if (timezoneMatch) {
    const sign = timezoneMatch[1][0] === "+" ? 1 : -1;
    const hours = parseInt(timezoneMatch[1].substring(1), 10);
    const minutes = parseInt(timezoneMatch[2], 10);
    const offsetInMinutes = sign * (hours * 60 + minutes);

    const systemOffsetInMinutes = date.getTimezoneOffset();
    const adjustmentInMinutes = offsetInMinutes + systemOffsetInMinutes;
    date.setMinutes(date.getMinutes() + adjustmentInMinutes);
  }

  // Manually format the date to ensure a consistent output
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

/**
 * Transforms the raw API response data into an array of CalendarEvent objects.
 *
 * @param data The raw API response data.
 * @returns An array of CalendarEvent objects.
 */
function transformApiData(data: ApiResponse, timezone: string): CalendarEvent[] {
  return Object.values(data).flatMap((eventsInCategory) =>
    eventsInCategory.map((event: ApiEvent) => ({
      title: event.title,
      start: parseApiTime(event.start_time, event.is_local_time, timezone),
      end: parseApiTime(event.end_time, event.is_local_time, timezone),
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
export const fetchEvents = async (timezone: string): Promise<CalendarEvent[]> => {
  const response = await fetch(GITHUB_EVENTS_API_URL);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: ApiResponse = await response.json();

  return transformApiData(data, timezone);
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
  const data = await response.json();
  // Map the fetched data to a format that's easier to use in the Select component
  return data.map((tz: any) => ({
    text: tz.text,
    value: tz.utc[0],
  }));
};
