import type { EventContentArg } from '@fullcalendar/core';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, IconButton, useTheme } from '@mui/material';
import React from 'react';
import type { CalendarEvent } from '../../types/events';
import { getColorForCategory } from '../../utils/colorUtils';

interface CalendarEventContentProps {
  eventInfo: EventContentArg;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
  onMouseEnter: (
    e: React.MouseEvent<HTMLElement>,
    event: CalendarEvent
  ) => void;
  onMouseLeave: () => void;
}

export const CalendarEventContent = React.memo(function CalendarEventContent({
  eventInfo,
  isSaved,
  onToggleSave,
  onMouseEnter,
  onMouseLeave,
}: CalendarEventContentProps) {
  const theme = useTheme();
  const { category, article_url } = eventInfo.event.extendedProps;
  const backgroundColor = getColorForCategory(category, theme.palette.mode);

  return (
    <Box
      sx={{
        backgroundColor,
        color: theme.palette.getContrastText(backgroundColor),
        borderRadius: '4px',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        border: `1px solid ${theme.palette.divider}`,
        boxSizing: 'border-box',
        boxShadow: theme.shadows[1],
        transition: 'box-shadow 0.15s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
        },
      }}
      onMouseEnter={(e) =>
        onMouseEnter(e, eventInfo.event as unknown as CalendarEvent)
      }
      onMouseLeave={onMouseLeave}
    >
      <Box
        sx={{
          p: '2px 8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <b>{eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
      </Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(article_url);
        }}
        sx={{ color: 'inherit' }}
      >
        {isSaved ? (
          <StarIcon fontSize="inherit" />
        ) : (
          <StarBorderIcon fontSize="inherit" />
        )}
      </IconButton>
    </Box>
  );
});
