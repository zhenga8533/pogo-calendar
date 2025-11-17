import { createEvent, createEvents, type EventAttributes } from 'ics';
import type { CalendarEvent } from '../types/events';

/**
 * Converts a CalendarEvent to an ICS EventAttributes object.
 *
 * @param event The calendar event to convert.
 * @returns The ICS event attributes or null if the event is invalid.
 */
function eventToIcsAttributes(event: CalendarEvent): EventAttributes | null {
  if (!event.start || !event.end) {
    console.error(
      'Cannot create .ics attributes for event with no start or end date.'
    );
    return null;
  }

  const start = new Date(event.start);
  const end = new Date(event.end);

  return {
    title: event.title,
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes(),
    ],
    description: `For more details, visit: ${event.extendedProps.article_url}`,
    url: event.extendedProps.article_url,
    calName: 'Pokémon GO Event Calendar',
  };
}

/**
 * Triggers a download of an .ics file with the given content.
 *
 * @param content The .ics file content.
 * @param filename The filename for the download.
 */
function triggerIcsDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Delay cleanup to ensure download starts
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 100);
}

/**
 * Download an .ics file for a given calendar event.
 *
 * @param event The calendar event to create the .ics file for.
 * @returns {void}
 */
export function downloadIcsFile(event: CalendarEvent) {
  const eventAttributes = eventToIcsAttributes(event);
  if (!eventAttributes) {
    return;
  }

  // Generate the .ics file content
  createEvent(eventAttributes, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const filename = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
    triggerIcsDownload(value, filename);
  });
}

/**
 * Download an .ics file for multiple calendar events.
 *
 * @param events Array of calendar events to create the .ics file for.
 */
export function downloadIcsForEvents(events: CalendarEvent[]) {
  const eventAttributesList: EventAttributes[] = events
    .map((event) => eventToIcsAttributes(event))
    .filter((attr): attr is EventAttributes => attr !== null);

  if (eventAttributesList.length === 0) {
    console.error('No valid events to export.');
    return;
  }

  // Generate the .ics file content
  createEvents(eventAttributesList, (error, value) => {
    if (error) {
      console.error(error);
      return;
    }

    const filename = 'pogo-calendar-export.ics';
    triggerIcsDownload(value, filename);
  });
}
