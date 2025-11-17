import { useCallback, useEffect, useState } from 'react';
import { SAVED_EVENTS_KEY } from '../config/constants';
import { safeGetJSON, safeSetJSON } from '../utils/storageUtils';

export function useSavedEvents() {
  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => {
    return safeGetJSON<string[]>(SAVED_EVENTS_KEY, []);
  });

  useEffect(() => {
    safeSetJSON(SAVED_EVENTS_KEY, savedEventIds);
  }, [savedEventIds]);

  const handleToggleSaveEvent = useCallback((eventId: string) => {
    setSavedEventIds((prevIds) =>
      prevIds.includes(eventId)
        ? prevIds.filter((id) => id !== eventId)
        : [...prevIds, eventId]
    );
  }, []);

  return { savedEventIds, handleToggleSaveEvent };
}
