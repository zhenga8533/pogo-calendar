import { useEffect, useState } from "react";

type EventStatus = "active" | "upcoming" | "finished";

/**
 * Helper to calculate time difference in a human-readable format.
 *
 * @param targetDate The future date to compare against the current time.
 * @param showSeconds Whether to include seconds in the output.
 * @returns A formatted string representing the time difference.
 */
function formatTimeDifference(targetDate: Date, showSeconds: boolean = true): string {
  const difference = targetDate.getTime() - new Date().getTime();
  if (difference <= 0) return "";

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (showSeconds && seconds > 0) parts.push(`${seconds}s`);
  if (parts.length === 0 && difference > 0 && showSeconds) return `<1s`;

  return parts.join(" ");
}

/**
 * Helper to format how long ago a date was.
 *
 * @param pastDate The past date to compare against the current time.
 * @returns A formatted string representing how long ago the date was.
 */
function formatTimeAgo(pastDate: Date): string {
  const difference = new Date().getTime() - pastDate.getTime();
  if (difference < 0) return "";

  const seconds = Math.floor(difference / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

/**
 * Helper to determine the event status and display time.
 *
 * @param start The start date of the event.
 * @param end The end date of the event.
 * @returns An object containing the event status and the display time.
 */
export function useEventStatus(start: Date | null, end: Date | null) {
  const [status, setStatus] = useState<EventStatus>("finished");
  const [displayTime, setDisplayTime] = useState<string>("");

  // Update status and display time every second
  useEffect(() => {
    if (!start || !end) {
      setStatus("finished");
      setDisplayTime("");
      return;
    }

    // Function to update status and display time
    const updateStatus = () => {
      const now = new Date();
      if (now < start) {
        setStatus("upcoming");
        setDisplayTime(formatTimeDifference(start));
      } else if (now >= start && now <= end) {
        setStatus("active");
        setDisplayTime(formatTimeDifference(end));
      } else {
        setStatus("finished");
        setDisplayTime(formatTimeAgo(end));
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, [start, end]);

  return { status, displayTime };
}
