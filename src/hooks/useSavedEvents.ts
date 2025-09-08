import { useEffect, useState } from "react";

/**
 * Custom hook to manage saved events using localStorage.
 *
 * @returns An object containing saved event IDs and a function to toggle saving an event.
 */
export function useSavedEvents() {
  // Initialize saved event IDs from localStorage or use an empty array
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedEventIds");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist saved event IDs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedEventIds", JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  // Function to toggle saving or unsaving an event by its ID
  const handleToggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  return { savedEventIds, handleToggleSaveEvent };
}
