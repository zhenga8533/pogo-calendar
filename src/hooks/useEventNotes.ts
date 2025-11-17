import { useCallback, useEffect, useState } from 'react';
import { EVENT_NOTES_KEY } from '../config/constants';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';

type EventNotes = Record<string, string>;

export function useEventNotes() {
  const [eventNotes, setEventNotes] = useState<EventNotes>(() => {
    return safeGetJSON<EventNotes>(EVENT_NOTES_KEY, {});
  });

  useEffect(() => {
    safeSetJSON(EVENT_NOTES_KEY, eventNotes);
  }, [eventNotes]);

  const updateNote = useCallback((eventId: string, noteText: string) => {
    setEventNotes((prevNotes) => {
      const newNotes = { ...prevNotes };
      if (noteText.trim()) {
        newNotes[eventId] = noteText;
      } else {
        delete newNotes[eventId];
      }
      return newNotes;
    });
  }, []);

  return { eventNotes, updateNote };
}
