import { fromZonedTime } from "date-fns-tz";
import type { ApiEvent, ApiResponse, CalendarEvent } from "../types/events";

/**
 * Parses a time value from the API into a definitive Date object.
 * @param time The time value from the API (string or UTC timestamp).
 * @param isLocal Indicates if the time is a "floating" local time string.
 * @param sourceTimeZone The IANA time zone to interpret the floating time string in.
 * @returns A Date object.
 */
function parseApiDate(time: string | number, isLocal: boolean, sourceTimeZone: string): Date {
  if (isLocal) {
    // This is the key: interpret the "local" date string AS IF it were in the source time zone,
    // and convert it to a universal, absolute UTC Date object.
    return fromZonedTime(time as string, sourceTimeZone);
  }

  // For UTC timestamps, simply convert from seconds to milliseconds.
  return new Date((time as number) * 1000);
}

/**
 * Transforms the raw API response data into an array of CalendarEvent objects with proper Date objects.
 * @param data The raw API response data.
 * @param sourceTimeZone The IANA time zone for interpreting local time events.
 * @returns An array of CalendarEvent objects.
 */
export function transformApiData(data: ApiResponse, sourceTimeZone: string): CalendarEvent[] {
  return Object.values(data).flatMap((eventsInCategory) =>
    eventsInCategory.map((event: ApiEvent) => ({
      title: event.title,
      start: parseApiDate(event.start_time, event.is_local_time, sourceTimeZone),
      end: parseApiDate(event.end_time, event.is_local_time, sourceTimeZone),
      extendedProps: {
        category: event.category,
        article_url: event.article_url,
        banner_url: event.banner_url,
        is_local_time: event.is_local_time,
      },
    }))
  );
}
