import { type Duration } from "date-fns";

/**
 * Parses a date string (YYYY-MM-DDTHH:mm:ss) into a Date object
 * that represents that exact time in the user's local timezone,
 * avoiding the automatic UTC conversion issues of `new Date()`.
 * If the input is already a Date object, it's returned as is.
 * @param date The date string or Date object.
 * @returns A Date object.
 */
export function parseFloatingDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  // This robustly parses the date string into its components
  // and creates a Date object that correctly represents the literal time
  // in the user's local environment.
  const parts = date.split(/[-T:]/).map(Number);
  // Note: Month is 0-indexed in JavaScript's Date constructor.
  return new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] || 0);
}

/**
 * Formats a date object into a readable string in a specific time zone.
 *
 * @param date The date to format.
 * @param timeZone The IANA time zone identifier (e.g., "America/New_York"). If undefined, the browser's local time zone is used for formatting.
 * @param showTime If true, includes the time in the output. Defaults to true.
 * @returns A formatted date string.
 */
export function formatDateLine(
  date: Date | null,
  timeZone: string | undefined,
  showTime: boolean = true
): string | null {
  if (!date) return null;

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timeZone,
  };

  if (showTime) {
    options.hour = "numeric";
    options.minute = "2-digit";
    // Only add the time zone name label for non-floating (UTC) events
    if (timeZone) {
      options.timeZoneName = "short";
    }
  }

  return date.toLocaleString("en-US", options);
}

/**
 * Formats a time duration into a compact, readable string.
 *
 * @param duration A Duration object from date-fns.
 * @returns A formatted string like "5y 3m 10d 8h 30min".
 */
export function formatDurationFromInterval(duration: Duration): string {
  const parts: string[] = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years}y`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months}m`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}min`);
  if (duration.seconds && duration.seconds > 0 && parts.length === 0) parts.push(`${duration.seconds}s`);
  return parts.length > 0 ? parts.join(" ") : "0min";
}
