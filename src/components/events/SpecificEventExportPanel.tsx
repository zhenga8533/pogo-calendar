import React, { useCallback } from 'react';
import type { CalendarEvent } from '../../types/events';
import { ColorKeyLabel } from '../filters/ColorKeyLabel';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

interface SpecificEventExportPanelProps {
  eventsToList: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  savedEventIds: string[];
  selectedEventIds: string[];
  onSelectionChange: (newSelection: string[]) => void;
}

export const SpecificEventExportPanel = React.memo(function SpecificEventExportPanel({
  eventsToList,
  filteredEvents,
  savedEventIds,
  selectedEventIds,
  onSelectionChange,
}: SpecificEventExportPanelProps) {
  const handleToggleEvent = useCallback(
    (eventId: string) => {
      const newSelection = selectedEventIds.includes(eventId)
        ? selectedEventIds.filter((id) => id !== eventId)
        : [...selectedEventIds, eventId];
      onSelectionChange(newSelection);
    },
    [selectedEventIds, onSelectionChange]
  );

  const handleSelectSaved = useCallback(() => {
    const savedIdsInFilter = filteredEvents
      .filter((e) => savedEventIds.includes(e.extendedProps.article_url))
      .map((e) => e.extendedProps.article_url);
    onSelectionChange(Array.from(new Set([...selectedEventIds, ...savedIdsInFilter])));
  }, [filteredEvents, savedEventIds, selectedEventIds, onSelectionChange]);

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={handleSelectSaved}>
          Select Saved
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSelectionChange(eventsToList.map((e) => e.extendedProps.article_url))}
        >
          Select All Shown
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onSelectionChange([])}>
          Clear All
        </Button>
      </div>
      <Separator />
      <div className="max-h-[min(52vh,32rem)] overflow-y-auto p-1 max-sm:max-h-none">
        {eventsToList.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {eventsToList.map((event) => (
              <label key={event.extendedProps.article_url} className="flex items-center gap-2.5 text-sm">
                <Checkbox
                  checked={selectedEventIds.includes(event.extendedProps.article_url)}
                  onCheckedChange={() => handleToggleEvent(event.extendedProps.article_url)}
                />
                <span className="flex items-center gap-2">
                  <ColorKeyLabel category={event.extendedProps.category} showText={false} />
                  <span>{event.title}</span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">No events to display.</p>
        )}
      </div>
    </div>
  );
});
