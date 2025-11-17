import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import defaultBanner from '../assets/images/default-banner.jpg';
import { CUSTOM_EVENT_CATEGORY, CUSTOM_EVENTS_KEY } from '../config/constants';
import type { CalendarEvent, NewEventData } from '../types/events';
import { formatToLocalTime } from '../utils/dateUtils';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';

export function useCustomEvents() {
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(() => {
    return safeGetJSON<CalendarEvent[]>(CUSTOM_EVENTS_KEY, []);
  });

  useEffect(() => {
    safeSetJSON(CUSTOM_EVENTS_KEY, customEvents);
  }, [customEvents]);

  const addEvent = useCallback((eventData: NewEventData) => {
    const newEvent: CalendarEvent = {
      title: eventData.title,
      start: formatToLocalTime(eventData.start),
      end: formatToLocalTime(eventData.end),
      extendedProps: {
        category: CUSTOM_EVENT_CATEGORY,
        article_url: uuidv4(),
        banner_url: defaultBanner,
      },
    };
    setCustomEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  const updateEvent = useCallback(
    (eventId: string, eventData: NewEventData) => {
      setCustomEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.extendedProps.article_url === eventId
            ? {
                ...event,
                title: eventData.title,
                start: formatToLocalTime(eventData.start),
                end: formatToLocalTime(eventData.end),
              }
            : event
        )
      );
    },
    []
  );

  const deleteEvent = useCallback((eventId: string) => {
    setCustomEvents((prevEvents) =>
      prevEvents.filter((event) => event.extendedProps.article_url !== eventId)
    );
  }, []);

  return {
    customEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}
