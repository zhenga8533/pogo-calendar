import { GITHUB_EVENTS_API_URL, TIMEZONES_API_URL } from "../config/api";
import type { ApiEvent, CalendarEvent } from "../types/events";
import type { Timezone } from "../types/settings";

type ApiResponse = Record<string, ApiEvent[]>;

function parseApiTime(time: string | number, isLocal: boolean, timezone: string): string {
  let date: Date;

  if (isLocal && typeof time === "string") {
    return time;
  } else if (typeof time === "number") {
    date = new Date(time * 1000);
  } else {
    // Handle null or undefined end_time
    if (time === null && isLocal && typeof time === "string") {
      const startDate = new Date(time);
      startDate.setHours(startDate.getHours() + 1); // Default to a 1-hour duration if end is null
      return startDate.toISOString();
    }
    throw new Error("Invalid time format. Expected UNIX timestamp for UTC time.");
  }

  // Transform to the specified timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  const hour = parts.find((p) => p.type === "hour")?.value;
  const minute = parts.find((p) => p.type === "minute")?.value;
  const second = parts.find((p) => p.type === "second")?.value;

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
      end: event.end_time
        ? parseApiTime(event.end_time, event.is_local_time, timezone)
        : new Date(
            new Date(parseApiTime(event.start_time, event.is_local_time, timezone)).getTime() + 60 * 60 * 1000
          ).toISOString(),
      extendedProps: {
        category: event.category,
        article_url: event.article_url,
        banner_url: event.banner_url,
        description: event.description,
        bonuses: event.bonuses,
        features: event.features,
        spawns: event.spawns,
        eggs: event.eggs,
        raids: event.raids,
        shiny: event.shiny,
        shadow: event.shadow,
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
  const response = await fetch(GITHUB_EVENTS_API_URL, { cache: "no-store" });

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
