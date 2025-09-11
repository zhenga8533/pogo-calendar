import { format, type Duration } from "date-fns";

/**
 * Formats a date object into a readable string.
 *
 * @param date The date to format.
 * @param showTime If true, includes the time in the output. Defaults to true.
 * @returns A formatted date string (e.g., "Sep 11, 2025 10:45 AM").
 */
export function formatDateLine(date: Date | null, showTime: boolean = true): string | null {
  if (!date) return null;
  return showTime ? format(date, "MMM d, yyyy h:mm a") : format(date, "MMM d, yyyy");
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
