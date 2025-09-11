import { useCallback, useEffect, useState } from "react";
import { SAVED_EVENTS_KEY } from "../config/storage";

/**
 * Custom hook to manage saved event IDs with localStorage persistence.
 *
 * @returns A custom hook to manage saved event IDs with localStorage persistence.
 */
export function useSavedEvents() {
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_EVENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse saved event IDs from localStorage:", error);
      return [];
    }
  });

  // Effect to persist the list of saved IDs to localStorage whenever it changes.
  useEffect(() => {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  // Function to toggle the saved state of an event by its ID.
  const handleToggleSaveEvent = useCallback((eventId: string) => {
    setSavedEventIds((prevIds) =>
      prevIds.includes(eventId) ? prevIds.filter((id) => id !== eventId) : [...prevIds, eventId]
    );
  }, []);

  return { savedEventIds, handleToggleSaveEvent };
}
