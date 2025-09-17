import { format } from "date-fns";

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
 * Formats a date string into a readable string.
 *
 * @param dateString The date string to format.
 * @param hour12 If true, use 12-hour format.
 * @param showTime If true, includes the time in the output. Defaults to true.
 * @returns A formatted date string (e.g., "Sep 11, 2025 10:45 AM").
 */
export function formatDateLine(dateString: string | null, hour12: boolean, showTime: boolean = true): string | null {
  if (!dateString) return null;
  const date = toDate(dateString);
  if (!date) return null;

  const formatString = showTime ? `MMM d, yyyy ${hour12 ? "h:mm a" : "HH:mm"}` : "MMM d, yyyy";
  return format(date, formatString);
}
