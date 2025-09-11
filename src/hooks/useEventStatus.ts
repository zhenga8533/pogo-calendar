import { formatDistanceToNowStrict, intervalToDuration, type Duration } from "date-fns";
import { useEffect, useState } from "react";

type EventStatus = "active" | "upcoming" | "finished" | "loading";

/**
 * Formats a Duration object into a concise, human-readable string.
 *
 * @param duration A Duration object containing days, hours, minutes, and seconds.
 * @returns A formatted string representing the duration in a human-readable format.
 */
function formatDuration(duration: Duration): string {
  const parts = [];
  if (duration.days && duration.days > 0) parts.push(`${duration.days}d`);
  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}m`);
  if (parts.length === 0 && duration.seconds && duration.seconds > 0) parts.push(`${duration.seconds}s`);
  return parts.join(" ");
}

/**
 * Custom hook to determine the status of an event based on its start and end dates.
 *
 * @param start The start date of the event.
 * @param end The end date of the event.
 * @returns An object containing the event status and the display time.
 */
export function useEventStatus(start: Date | null, end: Date | null) {
  const [status, setStatus] = useState<EventStatus>("loading");
  const [displayTime, setDisplayTime] = useState<string>("");

  useEffect(() => {
    // If either date is missing, we can't determine the status.
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
        setDisplayTime(formatDuration(duration));
      } else if (now >= start && now <= end) {
        setStatus("active");
        const duration = intervalToDuration({ start: now, end: end });
        setDisplayTime(formatDuration(duration));
      } else {
        setStatus("finished");
        setDisplayTime(formatDistanceToNowStrict(end, { addSuffix: true }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return { status, displayTime };
}
