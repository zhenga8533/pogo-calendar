import { formatDistanceToNowStrict, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { formatDurationFromInterval, toDate } from "../utils/dateUtils";

type EventStatus = "active" | "upcoming" | "finished" | "loading";

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
