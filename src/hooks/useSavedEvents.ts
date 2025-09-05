import { useEffect, useState } from "react";

export function useSavedEvents() {
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedEventIds");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("savedEventIds", JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  const handleToggleSaveEvent = (eventId: string) => {
    setSavedEventIds((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  return { savedEventIds, handleToggleSaveEvent };
}
