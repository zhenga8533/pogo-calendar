import { useCallback, useEffect, useState } from "react";
import { SAVED_EVENTS_KEY } from "../config/constants";

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

  useEffect(() => {
    localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  const handleToggleSaveEvent = useCallback((eventId: string) => {
    setSavedEventIds((prevIds) =>
      prevIds.includes(eventId) ? prevIds.filter((id) => id !== eventId) : [...prevIds, eventId]
    );
  }, []);

  return { savedEventIds, handleToggleSaveEvent };
}
