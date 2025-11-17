import { Box, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useEventStatus } from '../../hooks/useEventStatus';

interface EventStatusTagProps {
  start: string | null;
  end: string | null;
}

function EventStatusTagComponent({ start, end }: EventStatusTagProps) {
  const theme = useTheme();
  const { status, displayTime } = useEventStatus(start, end);

  const statusInfo = useMemo(
    () => ({
      active: { label: 'Active', color: theme.palette.success.main },
      upcoming: { label: 'Upcoming', color: theme.palette.warning.main },
      finished: { label: 'Finished', color: theme.palette.text.secondary },
    }),
    [theme]
  );

  if (!status) {
    return null;
  }

  const currentStatusInfo = statusInfo[status];

  return (
    <Box
      sx={{
        backgroundColor: currentStatusInfo.color,
        color: theme.palette.getContrastText(currentStatusInfo.color),
        borderRadius: '6px',
        px: 1.5,
        py: 0.5,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        height: '24px',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {status === 'finished'
        ? currentStatusInfo.label
        : `${currentStatusInfo.label} (${displayTime})`}
    </Box>
  );
}

export const EventStatusTag = React.memo(EventStatusTagComponent);
EventStatusTag.displayName = 'EventStatusTag';
