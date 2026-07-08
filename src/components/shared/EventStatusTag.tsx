import React, { useMemo } from 'react';
import { useEventStatus } from '../../hooks/useEventStatus';
import { cn } from '../../lib/utils';

interface EventStatusTagProps {
  start: string | null;
  end: string | null;
}

const statusClasses: Record<'active' | 'upcoming' | 'finished', string> = {
  active: 'bg-success text-success-foreground',
  upcoming: 'bg-warning text-warning-foreground',
  finished: 'bg-muted text-muted-foreground',
};

function EventStatusTagComponent({ start, end }: EventStatusTagProps) {
  const { status, displayTime } = useEventStatus(start, end);

  const label = useMemo(() => {
    if (!status) return null;
    const text = status === 'active' ? 'Active' : status === 'upcoming' ? 'Upcoming' : 'Finished';
    return status === 'finished' ? text : `${text} (${displayTime})`;
  }, [status, displayTime]);

  if (!status) return null;

  return (
    <span
      className={cn(
        'inline-flex h-6 items-center whitespace-nowrap rounded-md px-2.5 text-xs font-semibold',
        statusClasses[status]
      )}
    >
      {label}
    </span>
  );
}

export const EventStatusTag = React.memo(EventStatusTagComponent);
EventStatusTag.displayName = 'EventStatusTag';
