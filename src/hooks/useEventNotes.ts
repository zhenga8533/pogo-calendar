import { useCallback, useEffect, useState } from 'react';
import { EVENT_NOTES_KEY } from '../config/constants';

type EventNotes = Record<string, string>;

export function useEventNotes() {
  const [eventNotes, setEventNotes] = useState<EventNotes>(() => {
    try {
      const saved = localStorage.getItem(EVENT_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Failed to parse event notes from localStorage:', error);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(EVENT_NOTES_KEY, JSON.stringify(eventNotes));
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
