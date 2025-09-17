import { useCallback, useEffect, useState } from "react";
import { EVENT_NOTES_KEY } from "../config/storage";

type EventNotes = Record<string, string>;

/**
 * Custom hook to manage user-created notes for events with localStorage persistence.
 *
 * @returns An object containing the notes and a function to update them.
 */
export function useEventNotes() {
  const [eventNotes, setEventNotes] = useState<EventNotes>(() => {
    try {
      const saved = localStorage.getItem(EVENT_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to parse event notes from localStorage:", error);
      return {};
    }
  });

  // Persist notes to localStorage whenever they change.
  useEffect(() => {
    localStorage.setItem(EVENT_NOTES_KEY, JSON.stringify(eventNotes));
  }, [eventNotes]);

  /**
   * Updates or deletes a note for a specific event.
   * If the note text is empty, the note is deleted.
   */
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
