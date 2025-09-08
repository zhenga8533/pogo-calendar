import { createEvent, type EventAttributes } from "ics";
import type { CalendarEvent } from "../types/events";

export function downloadIcsFile(event: CalendarEvent) {
  if (!event.start || !event.end) {
    console.error("Cannot create .ics file for event with no start or end date.");
    return;
  }

  const start = new Date(event.start);
  const end = new Date(event.end);

  const eventAttributes: EventAttributes = {
    title: event.title,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
    end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
    description: `For more details, visit: ${event.extendedProps.article_url}`,
    url: event.extendedProps.article_url,
    calName: "Pokémon GO Event Calendar",
  };

  createEvent(eventAttributes, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    const filename = `${event.title.replace(/[^a-zA-Z0-9]/g, "_")}.ics`;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  });
}
