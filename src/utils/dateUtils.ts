import { format, type Duration } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

/**
 * Safely converts a string or Date into a valid Date object, or null.
 *
 * @param value The input value to convert.
 * @returns A valid Date object, or null if the input is invalid.
 */
export function toDate(value: Date | string | null | undefined): Date | null {
  if (!value) return null;
  // If it's already a Date object, return it directly (after validation).
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  const date = new Date(value);
  // Check if parsing the string resulted in a valid date.
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Validates if a given string is a valid IANA time zone.
 *
 * @param timeZone The string to validate.
 * @returns True if the time zone is valid, false otherwise.
 */
function isValidTimeZone(timeZone: string): boolean {
  try {
    // The Intl.DateTimeFormat constructor will throw an error if the time zone is invalid.
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Formats a date object into a readable string in a specific timezone.
 *
 * @param date The date to format.
 * @param showTime If true, includes the time in the output. Defaults to true.
 * @param timeZone The IANA time zone identifier.
 * @returns A formatted date string (e.g., "Sep 11, 2025 10:45 AM").
 */
export function formatDateLine(date: Date | null, showTime: boolean = true, timeZone: string): string | null {
  if (!date) return null;
  const formatString = showTime ? "MMM d, yyyy h:mm a" : "MMM d, yyyy";
  // Use a valid fallback if the provided timezone is incorrect
  const tz = isValidTimeZone(timeZone) ? timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    return formatInTimeZone(date, tz, formatString);
  } catch (error) {
    console.error("Error formatting date:", { date, tz, error });
    // As a final fallback, format in the local time of the browser
    return format(date, formatString);
  }
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
