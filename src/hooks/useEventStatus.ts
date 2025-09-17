import { formatDistanceToNowStrict, intervalToDuration, type Duration } from "date-fns";
import { useEffect, useState } from "react";
import { toDate } from "../utils/dateUtils";

type EventStatus = "active" | "upcoming" | "finished" | "loading";

/**
 * Formats a time duration into a compact, readable string.
 *
 * @param duration A Duration object from date-fns.
 * @returns A formatted string like "5y 3m 10d 8h 30min".
 */
function formatDurationFromInterval(duration: Duration): string {
  const parts: string[] = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years}y`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months}m`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}min`);
  if (duration.seconds && duration.seconds > 0 && parts.length === 0) parts.push(`${duration.seconds}s`);
  return parts.length > 0 ? parts.join(" ") : "0min";
}

/**
 * Custom hook to determine the status of an event based on its start and end dates.
 *
 * @param startInput The start date of the event.
 * @param endInput The end date of the event.
 * @returns An object containing the event status and the display time.
 */
export function useEventStatus(startInput: Date | string | null, endInput: Date | string | null) {
  const [status, setStatus] = useState<EventStatus>("loading");
  const [displayTime, setDisplayTime] = useState<string>("");

  useEffect(() => {
    const start = toDate(startInput);
    const end = toDate(endInput);

    // If either date is missing or invalid, we can't determine the status.
    if (!start || !end) {
      setStatus("loading");
      setDisplayTime("");
      return;
    }

    // This interval updates the status and time every second, creating the live countdown.
    const interval = setInterval(() => {
      const now = new Date();

      if (now < start) {
        setStatus("upcoming");
        const duration = intervalToDuration({ start: now, end: start });
        setDisplayTime(formatDurationFromInterval(duration));
      } else if (now >= start && now <= end) {
        setStatus("active");
        const duration = intervalToDuration({ start: now, end: end });
        setDisplayTime(formatDurationFromInterval(duration));
      } else {
        setStatus("finished");
        setDisplayTime(formatDistanceToNowStrict(end, { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startInput, endInput]);

  return { status, displayTime };
}
