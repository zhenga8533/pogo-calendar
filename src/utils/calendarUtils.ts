import { createEvent, createEvents, type EventAttributes } from 'ics';
import type { CalendarEvent } from '../types/events';
import { getEventInstant } from './eventTimeUtils';

function toIcsDate(
  date: Date,
  useUtc: boolean
): EventAttributes['start'] {
  return useUtc
    ? [
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
      ]
    : [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ];
}

/**
 * Converts a CalendarEvent to an ICS EventAttributes object.
 *
 * @param event The calendar event to convert.
 * @returns The ICS event attributes or null if the event is invalid.
 */
function eventToIcsAttributes(
  event: CalendarEvent
): EventAttributes | null {
  if (!event.start || !event.end) {
    const errorMsg = 'Cannot create calendar file for event with no start or end date.';
    console.error(errorMsg);
    return null;
  }

  const usesAbsoluteTime = event.extendedProps.is_local_time === false;
  const start = usesAbsoluteTime
    ? getEventInstant(event, 'start')
    : new Date(event.start);
  const end = usesAbsoluteTime
    ? getEventInstant(event, 'end')
    : new Date(event.end);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    console.error('Cannot create calendar file for event with invalid dates.');
    return null;
  }

  return {
    title: event.title,
    start: toIcsDate(start, usesAbsoluteTime),
    end: toIcsDate(end, usesAbsoluteTime),
    description: `For more details, visit: ${event.extendedProps.article_url}`,
    url: event.extendedProps.article_url,
    calName: 'Pokémon GO Event Calendar',
    startInputType: usesAbsoluteTime ? 'utc' : 'local',
    startOutputType: usesAbsoluteTime ? 'utc' : 'local',
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
 * @returns A promise that resolves after the download starts.
 */
export function downloadIcsFile(
  event: CalendarEvent
): Promise<void> {
  const eventAttributes = eventToIcsAttributes(event);
  if (!eventAttributes) {
    return Promise.reject(new Error('Cannot export an event with invalid dates'));
  }

  return new Promise((resolve, reject) => {
    createEvent(eventAttributes, (error, value) => {
      if (error) {
        reject(new Error('Failed to generate calendar file', { cause: error }));
        return;
      }
      const filename = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
      triggerIcsDownload(value, filename);
      resolve();
    });
  });
}

/**
 * Download an .ics file for multiple calendar events.
 *
 * @param events Array of calendar events to create the .ics file for.
 * @returns A promise that resolves after the download starts.
 */
export function downloadIcsForEvents(
  events: CalendarEvent[]
): Promise<void> {
  const eventAttributesList: EventAttributes[] = events
    .map((event) => eventToIcsAttributes(event))
    .filter((attr): attr is EventAttributes => attr !== null);

  if (events.length === 0 || eventAttributesList.length !== events.length) {
    const errorMsg = 'One or more selected events have invalid dates';
    console.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  }

  return new Promise((resolve, reject) => {
    createEvents(eventAttributesList, (error, value) => {
      if (error) {
        reject(
          new Error('Failed to generate calendar export file', { cause: error })
        );
        return;
      }
      triggerIcsDownload(value, 'pogo-calendar-export.ics');
      resolve();
    });
  });
}
