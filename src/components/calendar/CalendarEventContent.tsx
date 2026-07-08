import type { EventContentArg } from '@fullcalendar/core';
import { Star } from 'lucide-react';
import React from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { useResolvedThemeMode } from '../../hooks/useThemeMode';
import type { CalendarEvent } from '../../types/events';
import { colorWithAlpha, getColorForCategory } from '../../utils/colorUtils';

interface CalendarEventContentProps {
  eventInfo: EventContentArg;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLElement>, event: CalendarEvent) => void;
  onMouseLeave: () => void;
}

export const CalendarEventContent = React.memo(function CalendarEventContent({
  eventInfo,
  isSaved,
  onToggleSave,
  onMouseEnter,
  onMouseLeave,
}: CalendarEventContentProps) {
  const { settings } = useSettingsContext();
  const mode = useResolvedThemeMode(settings.theme);
  const { category, article_url } = eventInfo.event.extendedProps;
  const baseColor = getColorForCategory(category, mode);

  return (
    <div
      className="group box-border flex h-full w-full cursor-pointer items-center justify-between overflow-hidden rounded px-1.5 transition-all duration-200 hover:-translate-y-px"
      style={{
        backgroundColor: colorWithAlpha(baseColor, 0.15),
        borderLeft: `4px solid ${baseColor}`,
      }}
      onMouseEnter={(e) => onMouseEnter(e, eventInfo.event as unknown as CalendarEvent)}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
        <span className="min-w-fit text-[0.7rem] font-bold opacity-80">{eventInfo.timeText}</span>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.7rem] font-medium">
          {eventInfo.event.title}
        </span>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(article_url);
        }}
        className="flex shrink-0 items-center justify-center p-0.5 text-muted-foreground transition-colors hover:text-primary"
      >
        <Star
          className="h-3.5 w-3.5"
          fill={isSaved ? 'hsl(var(--warning))' : 'none'}
          style={{ color: isSaved ? 'hsl(var(--warning))' : undefined }}
        />
      </button>
    </div>
  );
});
