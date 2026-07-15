import React, { useMemo } from 'react';
import { useEventStatus } from '../../hooks/useEventStatus';
import { Badge } from '../ui/badge';

interface EventStatusTagProps {
  start: string | null;
  end: string | null;
}

const statusVariant: Record<'active' | 'upcoming' | 'finished', 'success' | 'warning' | 'muted'> = {
  active: 'success',
  upcoming: 'warning',
  finished: 'muted',
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
    <Badge variant={statusVariant[status]} className="h-6 whitespace-nowrap px-2.5">
      {label}
    </Badge>
  );
}

export const EventStatusTag = React.memo(EventStatusTagComponent);
EventStatusTag.displayName = 'EventStatusTag';
