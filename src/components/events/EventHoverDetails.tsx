import { CalendarDays, Clock } from 'lucide-react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSettingsContext } from '../../hooks/useSettingsContext';
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

// Minimum gap kept between the tooltip and the viewport edge.
const VIEWPORT_MARGIN = 8;
// Gap kept between the tooltip and the cursor/anchor point.
const CURSOR_GAP = 14;

function EventHoverDetails({ open, mousePosition, event }: EventHoverDetailsProps) {
  const { settings } = useSettingsContext();
  const { hour12 } = settings;
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<{ top: number; left: number } | null>(null);

  const formattedStart = useMemo(
    () => (event?.start ? formatDateLine(event.start, hour12) : null),
    [event?.start, hour12]
  );
  const formattedEnd = useMemo(
    () => (event?.end ? formatDateLine(event.end, hour12) : null),
    [event?.end, hour12]
  );

  // Positions the tooltip above the cursor by default, flipping below it
  // when there isn't enough room above, and clamps both axes to the
  // viewport so it never renders off-screen.
  useLayoutEffect(() => {
    if (!mousePosition || !tooltipRef.current) {
      return;
    }

    const { width, height } = tooltipRef.current.getBoundingClientRect();
    const spaceAbove = mousePosition.top - CURSOR_GAP;
    const fitsAbove = spaceAbove - height >= VIEWPORT_MARGIN;
    const top = fitsAbove
      ? mousePosition.top - CURSOR_GAP - height
      : mousePosition.top + CURSOR_GAP;

    setPlacement({
      top: Math.min(Math.max(top, VIEWPORT_MARGIN), window.innerHeight - height - VIEWPORT_MARGIN),
      left: Math.min(
        Math.max(mousePosition.left - width / 2, VIEWPORT_MARGIN),
        window.innerWidth - width - VIEWPORT_MARGIN
      ),
    });
  }, [mousePosition]);

  if (!event || !mousePosition) {
    return null;
  }

  // Render at the raw cursor position on the first paint of a new hover so the
  // ref mounts and useLayoutEffect can measure and correct it before the
  // browser actually paints; `placement` is stale-but-harmless while that runs.
  const { top, left } = placement ?? mousePosition;

  return (
    <div
      ref={tooltipRef}
      role="tooltip"
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed z-50 w-[340px] max-w-[90vw] overflow-hidden rounded-xl border border-border bg-popover/95 text-popover-foreground shadow-soft-2xl backdrop-blur-md transition-opacity duration-100',
        open ? 'opacity-100' : 'opacity-0'
      )}
      style={{ top, left }}
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
