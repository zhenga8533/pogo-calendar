import { GITHUB_EVENTS_API_URL, TIMEZONES_API_URL } from '../config/api';
import { MS_PER_HOUR } from '../config/timeConstants';
import type { ApiEvent, CalendarEvent } from '../types/events';
import type { Timezone } from '../types/settings';

type ApiResponse = Record<string, ApiEvent[]>;

function parseApiTime(
  time: string | number,
  isLocal: boolean,
  timezone: string
): string {
  let date: Date;

  if (isLocal && typeof time === 'string') {
    // Validate the ISO string
    date = new Date(time);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid ISO date string: ${time}`);
    }
    return time;
  } else if (typeof time === 'number') {
    // Validate UNIX timestamp (should be positive and reasonable)
    if (time < 0 || time > 2147483647) {
      throw new Error(`Invalid UNIX timestamp: ${time}`);
    }
    date = new Date(time * 1000);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date created from UNIX timestamp: ${time}`);
    }
  } else {
    throw new Error(
      'Invalid time format. Expected ISO string for local time or UNIX timestamp for UTC time.'
    );
  }

  // Transform to the specified timezone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  try {
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const hour = parts.find((p) => p.type === 'hour')?.value;
    const minute = parts.find((p) => p.type === 'minute')?.value;
    const second = parts.find((p) => p.type === 'second')?.value;

    if (!year || !month || !day || !hour || !minute || !second) {
      throw new Error('Failed to format date parts');
    }

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  } catch (error) {
    console.error(`Error formatting date for timezone ${timezone}:`, error);
    // Fallback to ISO string if timezone formatting fails
    return date.toISOString();
  }
}

/**
 * Extracts detail fields from the details object.
 * Bonuses and all other fields (Pokemon-related) are passed through as-is.
 *
 * @param details The details object from the API event.
 * @returns An object containing all detail fields.
 */
function extractDetails(details?: { [key: string]: string[] }) {
  if (!details) {
    return {};
  }

  // Pass through all fields as-is
  return { ...details };
}

/**
 * Transforms the raw API response data into an array of CalendarEvent objects.
 *
 * @param data The raw API response data.
 * @returns An array of CalendarEvent objects.
 */
function transformApiData(
  data: ApiResponse,
  timezone: string
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  Object.values(data).forEach((eventsInCategory) => {
    eventsInCategory.forEach((event: ApiEvent) => {
      try {
        const extractedDetails = extractDetails(event.details);

        const startTime = parseApiTime(
          event.start_time,
          event.is_local_time,
          timezone
        );
        const endTime = event.end_time
          ? parseApiTime(event.end_time, event.is_local_time, timezone)
          : new Date(new Date(startTime).getTime() + MS_PER_HOUR).toISOString();

        events.push({
          title: event.title,
          start: startTime,
          end: endTime,
          extendedProps: {
            category: event.category,
            article_url: event.article_url,
            banner_url: event.banner_url,
            description: event.description,
            ...extractedDetails,
          },
        });
      } catch (error) {
        console.error(`Failed to parse event: ${event.title}`, error);
        // Skip invalid events rather than crashing the entire app
      }
    });
  });

  return events;
}

/**
 * Fetches events from the GitHub Events API and transforms them into CalendarEvent objects.
 *
 * @returns A promise that resolves to an array of CalendarEvent objects fetched from the API.
 */
export const fetchEvents = async (
  timezone: string
): Promise<CalendarEvent[]> => {
  const response = await fetch(GITHUB_EVENTS_API_URL, { cache: 'no-store' });

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
    throw new Error(
      `Timezone API request failed with status ${response.status}`
    );
  }
  const data = await response.json();
  // Map the fetched data to a format that's easier to use in the Select component
  return data.map((tz: any) => ({
    text: tz.text,
    value: tz.utc[0],
  }));
};
