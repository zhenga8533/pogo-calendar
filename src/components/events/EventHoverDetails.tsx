import { CalendarDays, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { cn } from '../../lib/utils';
import type { CalendarEvent } from '../../types/events';
import { formatDateLine } from '../../utils/dateUtils';
import { CategoryTag } from '../shared/CategoryTag';
import { EventStatusTag } from '../shared/EventStatusTag';

interface EventHoverDetailsProps {
  open: boolean;
  mousePosition: { top: number; left: number } | null;
  event: CalendarEvent | null;
  onClose: () => void;
}

function EventHoverDetails({ open, mousePosition, event }: EventHoverDetailsProps) {
  const { settings } = useSettingsContext();
  const { hour12 } = settings;

  const formattedStart = useMemo(
    () => (event?.start ? formatDateLine(event.start, hour12) : null),
    [event?.start, hour12]
  );
  const formattedEnd = useMemo(
    () => (event?.end ? formatDateLine(event.end, hour12) : null),
    [event?.end, hour12]
  );

  if (!event || !mousePosition) {
    return null;
  }

  return (
    <div
      role="tooltip"
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-50 w-[340px] max-w-[90vw] -translate-x-1/2 -translate-y-full overflow-hidden rounded-xl border border-border bg-popover/95 text-popover-foreground shadow-soft-2xl backdrop-blur-md transition-opacity duration-100',
        open ? 'opacity-100' : 'opacity-0'
      )}
      style={{ top: mousePosition.top - 14, left: mousePosition.left }}
    >
      <div className="border-b border-border p-4 pb-3.5">
        <h3 className="mb-2 text-[1.05rem] font-bold leading-snug">{event.title}</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <CategoryTag category={event.extendedProps.category} />
          <EventStatusTag start={event.start} end={event.end} />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4 pt-3.5">
        {event.start && (
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                Start Time
              </p>
              <p className="mt-0.5 text-sm font-medium">{formattedStart}</p>
            </div>
          </div>
        )}

        {event.end && (
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
            <div className="min-w-0 flex-1">
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                End Time
              </p>
              <p className="mt-0.5 text-sm font-medium">{formattedEnd}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventHoverDetails;
